/**
 * useAuth Hook
 *
 * Provides authentication state and methods
 */

import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { authService } from "../services/authService";
import { hasSupabaseConfig } from "../lib/supabase";
import {
  setUser,
  setSession,
  setLoading,
  setError,
  logout as logoutAction,
} from "../store/slices/userSlice";

const getAuthErrorMessage = (error, fallback, t) => {
  if (error?.code === 'email_not_confirmed' || /email not confirmed/i.test(error?.message || '')) {
    return t('auth.emailNotConfirmed');
  }
  return error?.message || fallback;
};

export const useAuth = () => {
  const dispatch = useDispatch();
  const authStore = useStore();
  const authRevisionRef = useRef(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { user, session, isLoading, isAuthenticated, error } = useSelector(
    (state) => state.user,
  );

  /**
   * Catch and clean up OAuth URL error query parameters (e.g. from Google login failure)
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));

    const error = urlParams.get('error') || hashParams.get('error');
    const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');

    if (error || errorDescription) {
      const cleanDesc = errorDescription
        ? decodeURIComponent(errorDescription).replace(/\+/g, ' ')
        : t('auth.oauthError');

      console.warn('OAuth Auth Error:', error, cleanDesc);
      toast.error(`${t('auth.loginError')}: ${cleanDesc}`, { duration: 6000 });

      // Clean up raw error query and hash params from browser address bar
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [t]);

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    if (!hasSupabaseConfig) {
      dispatch(setLoading(false));
      return undefined;
    }

    let isMounted = true;
    let subscription;
    // Newer auth events must invalidate older profile/session lookups.
    // Otherwise a SIGNED_OUT event can be undone by a late profile response.
    let authEventReceived = false;

    const hydrateUser = async (session, revision) => {
      if (!session || !isMounted || revision !== authRevisionRef.current) return;

      // A restored session object is not proof of the current identity.
      // Never unlock protected UI before getUser verifies its subject.
      let currentUser;
      try {
        currentUser = await authService.getCurrentUser();
      } catch (err) {
        console.error("Auth user hydration error:", err);
        return;
      }

      if (!currentUser || !isMounted || revision !== authRevisionRef.current) return;
      if (!session.user?.id || session.user.id !== currentUser.id) {
        console.error('Auth session identity mismatch: refusing to hydrate user');
        return;
      }

      dispatch(setSession(session));
      // Keep the authenticated identity usable even when the optional profile
      // record is temporarily unavailable. Profile data enriches the user; it
      // must not decide whether a valid Supabase session counts as signed in.
      dispatch(setUser({ ...currentUser, profile: null }));

      try {
        const profile = await authService.getProfile(currentUser.id);
        if (isMounted && revision === authRevisionRef.current) dispatch(setUser({ ...currentUser, profile }));
      } catch (err) {
        console.error("Auth profile hydration error:", err);
      }
    };

    const handleAuthStateChange = (event, newSession) => {
      if (!isMounted) return;
      authEventReceived = true;
      const revision = ++authRevisionRef.current;

      if (event === "SIGNED_OUT") {
        dispatch(logoutAction());
        dispatch(setLoading(false));
        return;
      }

      if (newSession) {
        // Do not await profile queries inside Supabase's auth callback.
        void hydrateUser(newSession, revision).finally(() => {
          if (isMounted && revision === authRevisionRef.current) dispatch(setLoading(false));
        });
      }
    };

    const initAuth = async () => {
      try {
        // Subscribe before reading the session so post-OAuth SIGNED_IN cannot
        // be missed while Supabase is processing the callback URL.
        const result = await authService.onAuthStateChange(handleAuthStateChange);
        subscription = result?.data?.subscription;

        const currentSession = await authService.getSession();
        // A newer auth callback (especially SIGNED_OUT) outranks the
        // potentially stale initial session snapshot.
        if (currentSession && !authEventReceived && isMounted) {
          await hydrateUser(currentSession, ++authRevisionRef.current);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        if (isMounted) dispatch(setLoading(false));
      }
    };

    void initAuth();

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [dispatch]);

  /**
   * Register a new user
   */
  const register = useCallback(
    async ({ email, password, fullName, username }) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const registration = await authService.register({ email, password, fullName, username });

        toast.success(registration.needsEmailConfirmation
          ? t("auth.registerConfirmationRequired")
          : t("auth.registerSuccess"));
        navigate(registration.needsEmailConfirmation ? "/auth/login?registered=1" : "/auth/login");

        return { success: true };
      } catch (err) {
        const message = getAuthErrorMessage(err, t("auth.registerError"), t);
        dispatch(setError(message));
        toast.error(message);
        return { success: false, error: message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, navigate, t],
  );

  /**
   * Login with email and password
   */
  const login = useCallback(
    async ({ email, password }) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const { session: newSession, user: newUser } = await authService.login({
          email,
          password,
        });

        // Treat incomplete or contradictory auth responses as failures rather
        // than granting protected UI access on a session snapshot alone.
        if (!newSession?.user?.id || !newUser?.id || newSession.user.id !== newUser.id) {
          throw new Error(t('auth.loginError'));
        }

        dispatch(setSession(newSession));
        dispatch(setUser({ ...newUser, profile: null }));

        // A provider sign-out or account switch may happen while optional
        // profile enrichment is pending. Never reinstate an obsolete identity.
        const isCurrentLogin = () => {
          const state = authStore.getState().user;
          return state.isAuthenticated &&
            state.user?.id === newUser.id &&
            state.session?.user?.id === newUser.id;
        };

        try {
          const profile = await authService.getProfile(newUser.id);
          if (isCurrentLogin()) dispatch(setUser({ ...newUser, profile }));
        } catch (profileError) {
          // Authentication already succeeded; profile enrichment may retry
          // independently without presenting a false login failure.
          console.error("Login profile hydration error:", profileError);
        }

        if (!isCurrentLogin()) {
          return { success: false, error: t("auth.loginError") };
        }

        toast.success(t("auth.loginSuccess"));
        navigate("/");

        return { success: true };
      } catch (err) {
        const message = getAuthErrorMessage(err, t("auth.loginError"), t);
        dispatch(setError(message));
        toast.error(message);
        return { success: false, error: message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, navigate, t],
  );

  /**
   * Login with OAuth provider
   */
  const loginWithOAuth = useCallback(
    async (provider) => {
      try {
        dispatch(setLoading(true));
        await authService.loginWithOAuth(provider);
        return { success: true };
      } catch (err) {
        const message = err.message || t("auth.oauthError");
        toast.error(message);
        return { success: false, error: message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, t],
  );

  /**
   * Logout current user
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
      // Local logout must also invalidate in-flight user/profile hydration
      // if a provider's SIGNED_OUT callback arrives after this promise.
      authRevisionRef.current += 1;
      dispatch(logoutAction());
      toast.success(t("auth.logoutSuccess"));
      navigate("/");
    } catch (err) {
      toast.error(err.message || t("auth.logoutError"));
    }
  }, [dispatch, navigate, t]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(
    async (updates) => {
      try {
        dispatch(setLoading(true));

        if (!user?.id) throw new Error("Not authenticated");

        const updatedProfile = await authService.updateProfile(
          user.id,
          updates,
        );
        dispatch(setUser({ ...user, profile: updatedProfile }));

        toast.success(t("auth.profileUpdated"));
        return { success: true, profile: updatedProfile };
      } catch (err) {
        const message = err.message || t("auth.profileUpdateError");
        toast.error(message);
        return { success: false, error: message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, user, t],
  );

  /**
   * Reset password
   */
  const resetPassword = useCallback(
    async (email) => {
      try {
        dispatch(setLoading(true));
        await authService.resetPassword(email);
        toast.success(t("auth.resetPasswordSent"));
        return { success: true };
      } catch (err) {
        const message = err.message || t("auth.resetPasswordError");
        toast.error(message);
        return { success: false, error: message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, t],
  );

  /**
   * Update password
   */
  const updatePassword = useCallback(
    async (newPassword) => {
      try {
        dispatch(setLoading(true));
        await authService.updatePassword(newPassword);
        toast.success(t("auth.passwordUpdated"));
        return { success: true };
      } catch (err) {
        const message = err.message || t("auth.passwordUpdateError");
        toast.error(message);
        return { success: false, error: message };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, t],
  );

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    error,
    register,
    login,
    loginWithOAuth,
    logout,
    updateProfile,
    resetPassword,
    updatePassword,
  };
};

export default useAuth;
