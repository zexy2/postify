import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import toast from 'react-hot-toast';
import userReducer from '../store/slices/userSlice';
import { authService } from '../services/authService';
import { useAuth } from './useAuth';

vi.mock('../lib/supabase', () => ({ hasSupabaseConfig: true }));
vi.mock('../services/authService', () => ({
  authService: {
    onAuthStateChange: vi.fn(),
    getSession: vi.fn(),
    getCurrentUser: vi.fn(),
    getProfile: vi.fn(),
    register: vi.fn(),
    login: vi.fn(),
    loginWithOAuth: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn(),
    resetPassword: vi.fn(),
    updatePassword: vi.fn(),
  },
}));
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));

const createWrapper = () => {
  const store = configureStore({ reducer: { user: userReducer } });
  return ({ children }) => (
    <Provider store={store}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  );
};

describe('useAuth hydration', () => {
  let consoleError;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    authService.onAuthStateChange.mockResolvedValue({ data: { subscription: { unsubscribe: vi.fn() } } });
  });

  afterEach(() => consoleError.mockRestore());

  it('keeps the authenticated identity when profile enrichment is unavailable', async () => {
    const session = { user: { id: 'auth-user-1' }, access_token: 'token' };
    const authUser = { id: 'auth-user-1', email: 'reader@example.com', user_metadata: { full_name: 'Reader' } };
    authService.getSession.mockResolvedValue(session);
    authService.getCurrentUser.mockResolvedValue(authUser);
    authService.getProfile.mockRejectedValue(new Error('profiles unavailable'));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toMatchObject({ id: 'auth-user-1', email: 'reader@example.com', profile: null });
    expect(consoleError).toHaveBeenCalledWith('Auth profile hydration error:', expect.any(Error));
  });
  it('does not report login failure when only profile enrichment fails', async () => {
    const session = { user: { id: 'auth-user-2' }, access_token: 'token-2' };
    const authUser = { id: 'auth-user-2', email: 'writer@example.com' };
    authService.getSession.mockResolvedValue(null);
    authService.login.mockResolvedValue({ session, user: authUser });
    authService.getProfile.mockRejectedValue(new Error('profiles unavailable'));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let response;
    await act(async () => {
      response = await result.current.login({ email: 'writer@example.com', password: 'valid-password' });
    });
    expect(response.success).toBe(true);

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toMatchObject({ id: 'auth-user-2', profile: null });
    expect(toast.success).toHaveBeenCalledWith('auth.loginSuccess');
    expect(toast.error).not.toHaveBeenCalledWith('auth.loginError');
    expect(consoleError).toHaveBeenCalledWith('Login profile hydration error:', expect.any(Error));
  });


  it('does not restore a signed-out user when a late profile request resolves', async () => {
    let emitAuthEvent;
    let resolveProfile;
    const session = { user: { id: 'signed-out-during-hydration' }, access_token: 'old-token' };
    const identity = { id: 'signed-out-during-hydration', email: 'reader@example.com' };
    authService.onAuthStateChange.mockImplementation(async (listener) => {
      emitAuthEvent = listener;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    authService.getSession.mockResolvedValue(session);
    authService.getCurrentUser.mockResolvedValue(identity);
    authService.getProfile.mockImplementation(() => new Promise((resolve) => {
      resolveProfile = resolve;
    }));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.user?.id).toBe(identity.id));
    expect(result.current.isAuthenticated).toBe(true);

    await act(async () => {
      emitAuthEvent('SIGNED_OUT', null);
    });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);

    await act(async () => {
      resolveProfile({ role: 'admin' });
      await Promise.resolve();
    });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });


  it('ignores an older session snapshot if sign-out happened while session lookup was pending', async () => {
    let emitAuthEvent;
    let resolveSession;
    authService.onAuthStateChange.mockImplementation(async (listener) => {
      emitAuthEvent = listener;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    authService.getSession.mockImplementation(() => new Promise((resolve) => {
      resolveSession = resolve;
    }));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    await waitFor(() => expect(authService.getSession).toHaveBeenCalledOnce());

    await act(async () => {
      emitAuthEvent('SIGNED_OUT', null);
      resolveSession({ user: { id: 'no-longer-signed-in' }, access_token: 'stale' });
      await Promise.resolve();
    });
    expect(authService.getCurrentUser).not.toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('keeps explicit logout authoritative even if the provider callback is delayed', async () => {
    let resolveProfile;
    const session = { user: { id: 'logout-call' }, access_token: 'old-token' };
    const identity = { id: 'logout-call', email: 'reader@example.com' };
    authService.getSession.mockResolvedValue(session);
    authService.getCurrentUser.mockResolvedValue(identity);
    authService.getProfile.mockImplementation(() => new Promise((resolve) => {
      resolveProfile = resolve;
    }));
    authService.logout.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.user?.id).toBe(identity.id));

    await act(async () => {
      await result.current.logout();
    });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);

    await act(async () => {
      resolveProfile({ role: 'admin' });
      await Promise.resolve();
    });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });


  it('never marks an unverified restored session authenticated if getUser fails', async () => {
    const session = { user: { id: 'unverified-identity' }, access_token: 'fixture-token' };
    authService.getSession.mockResolvedValue(session);
    authService.getCurrentUser.mockRejectedValue(new Error('network authentication unavailable'));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(consoleError).toHaveBeenCalledWith('Auth user hydration error:', expect.any(Error));
  });

  it('does not substitute a different authenticated identity for the session subject', async () => {
    authService.getSession.mockResolvedValue({ user: { id: 'account-1' }, access_token: 'fixture-token' });
    authService.getCurrentUser.mockResolvedValue({ id: 'account-2', email: 'another@example.com' });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(authService.getProfile).not.toHaveBeenCalled();
  });

  it('accepts a verified SIGNED_IN provider event after the initial empty session', async () => {
    let authEvent;
    authService.onAuthStateChange.mockImplementation(async (callback) => {
      authEvent = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    authService.getSession.mockResolvedValue(null);
    const session = { user: { id: 'oauth-user-1' }, access_token: 'oauth-token' };
    authService.getCurrentUser.mockResolvedValue({ id: 'oauth-user-1', email: 'oauth@example.com' });
    authService.getProfile.mockResolvedValue({ role: 'writer' });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);

    await act(async () => {
      authEvent('SIGNED_IN', session);
    });
    await waitFor(() => expect(result.current.user?.profile?.role).toBe('writer'));
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.session?.access_token).toBe('oauth-token');
  });

  it('does not call login successful if provider returns a session with no verified user', async () => {
    authService.getSession.mockResolvedValue(null);
    authService.login.mockResolvedValue({ session: { user: { id: 'unexpected' }, access_token: 'token' }, user: null });
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let response;
    await act(async () => {
      response = await result.current.login({ email: 'missing@example.com', password: 'test' });
    });
    expect(response.success).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(toast.success).not.toHaveBeenCalledWith('auth.loginSuccess');
  });

  it('does not restore a signed-out account after delayed password-login profile enrichment', async () => {
    let emitAuthEvent;
    let resolveProfile;
    const user = { id: 'password-login-race', email: 'login@example.com' };
    const session = { user: { id: user.id }, access_token: 'login-token' };
    authService.onAuthStateChange.mockImplementation(async (callback) => {
      emitAuthEvent = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    authService.getSession.mockResolvedValue(null);
    authService.login.mockResolvedValue({ session, user });
    authService.getProfile.mockImplementation(() => new Promise((resolve) => {
      resolveProfile = resolve;
    }));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let loginPromise;
    await act(async () => {
      loginPromise = result.current.login({ email: user.email, password: 'test-password' });
      await Promise.resolve();
    });
    await waitFor(() => expect(result.current.user?.id).toBe(user.id));

    await act(async () => { emitAuthEvent('SIGNED_OUT', null); });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);

    let outcome;
    await act(async () => {
      resolveProfile({ role: 'admin' });
      outcome = await loginPromise;
    });
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(outcome.success).toBe(false);
    expect(toast.success).not.toHaveBeenCalledWith('auth.loginSuccess');
  });

  it('clears the previous account while a different provider identity is awaiting verification', async () => {
    let emitAuthEvent;
    let resolveNextIdentity;
    const oldUser = { id: 'account-a', email: 'a@example.com' };
    const newUser = { id: 'account-b', email: 'b@example.com' };
    authService.onAuthStateChange.mockImplementation(async (listener) => {
      emitAuthEvent = listener;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    authService.getSession.mockResolvedValue({ user: oldUser, access_token: 'token-a' });
    authService.getCurrentUser.mockResolvedValueOnce(oldUser).mockImplementationOnce(
      () => new Promise((resolve) => { resolveNextIdentity = resolve; }),
    );
    authService.getProfile.mockResolvedValue({ role: 'reader' });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.user?.profile?.role).toBe('reader'));
    expect(result.current.user?.id).toBe(oldUser.id);

    await act(async () => {
      emitAuthEvent('SIGNED_IN', { user: newUser, access_token: 'token-b' });
      await Promise.resolve();
    });
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(true);

    await act(async () => { resolveNextIdentity(newUser); });
    await waitFor(() => expect(result.current.user?.id).toBe(newUser.id));
    expect(result.current.session?.user?.id).toBe(newUser.id);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('does not retain the previous account when a switched provider session cannot be verified', async () => {
    let emitAuthEvent;
    const oldUser = { id: 'account-a', email: 'a@example.com' };
    authService.onAuthStateChange.mockImplementation(async (listener) => {
      emitAuthEvent = listener;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    authService.getSession.mockResolvedValue({ user: oldUser, access_token: 'token-a' });
    authService.getCurrentUser.mockResolvedValueOnce(oldUser)
      .mockRejectedValueOnce(new Error('identity verification unavailable'));
    authService.getProfile.mockResolvedValue({ role: 'reader' });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.user?.profile?.role).toBe('reader'));

    await act(async () => {
      emitAuthEvent('SIGNED_IN', {
        user: { id: 'account-b' }, access_token: 'unverified-b',
      });
    });
    await waitFor(() => expect(authService.getCurrentUser).toHaveBeenCalledTimes(2));
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('does not resurrect a signed-out account after a delayed profile update', async () => {
    let emitAuthEvent;
    let resolveUpdate;
    const account = { id: 'profile-account-a', email: 'a@example.com' };
    const session = { user: account, access_token: 'account-a-token' };
    authService.onAuthStateChange.mockImplementation(async (listener) => {
      emitAuthEvent = listener;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    authService.getSession.mockResolvedValue(session);
    authService.getCurrentUser.mockResolvedValue(account);
    authService.getProfile.mockResolvedValue({ role: 'reader' });
    authService.updateProfile.mockImplementation(() => new Promise((resolve) => {
      resolveUpdate = resolve;
    }));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.user?.profile?.role).toBe('reader'));

    let updatePromise;
    await act(async () => {
      updatePromise = result.current.updateProfile({ full_name: 'Updated A' });
      await Promise.resolve();
    });
    expect(authService.updateProfile).toHaveBeenCalledWith(account.id, { full_name: 'Updated A' });

    await act(async () => { emitAuthEvent('SIGNED_OUT', null); });
    let outcome;
    await act(async () => {
      resolveUpdate({ role: 'admin', full_name: 'Updated A' });
      outcome = await updatePromise;
    });

    expect(outcome.success).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(toast.success).not.toHaveBeenCalledWith('auth.profileUpdated');
  });

  it('keeps a new account hidden while verifying if an old profile update finishes', async () => {
    let emitAuthEvent;
    let resolveUpdate;
    let resolveNextUser;
    const accountA = { id: 'profile-a', email: 'a@example.com' };
    const accountB = { id: 'profile-b', email: 'b@example.com' };
    authService.onAuthStateChange.mockImplementation(async (listener) => {
      emitAuthEvent = listener;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    authService.getSession.mockResolvedValue({ user: accountA, access_token: 'token-a' });
    authService.getCurrentUser.mockResolvedValueOnce(accountA)
      .mockImplementationOnce(() => new Promise((resolve) => { resolveNextUser = resolve; }));
    authService.getProfile.mockResolvedValue({ role: 'reader' });
    authService.updateProfile.mockImplementation(() => new Promise((resolve) => {
      resolveUpdate = resolve;
    }));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.user?.profile?.role).toBe('reader'));

    let updatePromise;
    await act(async () => {
      updatePromise = result.current.updateProfile({ full_name: 'Old A' });
      await Promise.resolve();
    });

    await act(async () => {
      emitAuthEvent('SIGNED_IN', { user: accountB, access_token: 'token-b' });
      await Promise.resolve();
    });
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(true);

    let outcome;
    await act(async () => {
      resolveUpdate({ role: 'admin', full_name: 'Old A' });
      outcome = await updatePromise;
    });
    expect(outcome.success).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(toast.success).not.toHaveBeenCalledWith('auth.profileUpdated');

    await act(async () => { resolveNextUser(accountB); });
    await waitFor(() => expect(result.current.user?.id).toBe(accountB.id));
    expect(result.current.session?.user?.id).toBe(accountB.id);
    expect(result.current.isLoading).toBe(false);
  });

  it('applies a successful profile edit to the same verified session', async () => {
    const account = { id: 'profile-positive', email: 'positive@example.com' };
    const session = { user: account, access_token: 'steady-token' };
    authService.getSession.mockResolvedValue(session);
    authService.getCurrentUser.mockResolvedValue(account);
    authService.getProfile.mockResolvedValue({ role: 'reader', full_name: 'Before' });
    authService.updateProfile.mockResolvedValue({ role: 'reader', full_name: 'After' });

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.user?.profile?.full_name).toBe('Before'));

    let response;
    await act(async () => {
      response = await result.current.updateProfile({ full_name: 'After' });
    });

    expect(authService.updateProfile).toHaveBeenCalledWith(account.id, { full_name: 'After' });
    expect(response).toMatchObject({ success: true, profile: { full_name: 'After' } });
    expect(result.current.user?.profile?.full_name).toBe('After');
    expect(result.current.session).toEqual(session);
    expect(result.current.isLoading).toBe(false);
    expect(toast.success).toHaveBeenCalledWith('auth.profileUpdated');
  });

  it('ignores an obsolete profile edit after same-account token refresh', async () => {
    let emitAuthEvent;
    let resolveUpdate;
    const account = { id: 'profile-refresh', email: 'refresh@example.com' };
    const session1 = { user: account, access_token: 'token-1' };
    const session2 = { user: account, access_token: 'token-2' };
    authService.onAuthStateChange.mockImplementation(async (listener) => {
      emitAuthEvent = listener;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    authService.getSession.mockResolvedValue(session1);
    authService.getCurrentUser.mockResolvedValue(account);
    authService.getProfile.mockResolvedValueOnce({ full_name: 'First' })
      .mockResolvedValueOnce({ full_name: 'Newer session' });
    authService.updateProfile.mockImplementation(() => new Promise((resolve) => {
      resolveUpdate = resolve;
    }));

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.user?.profile?.full_name).toBe('First'));

    let updatePromise;
    await act(async () => {
      updatePromise = result.current.updateProfile({ full_name: 'Stale edit' });
      await Promise.resolve();
    });
    await act(async () => {
      emitAuthEvent('TOKEN_REFRESHED', session2);
    });
    await waitFor(() => expect(result.current.user?.profile?.full_name).toBe('Newer session'));

    let response;
    await act(async () => {
      resolveUpdate({ full_name: 'Stale edit' });
      response = await updatePromise;
    });
    expect(response.success).toBe(false);
    expect(result.current.user?.profile?.full_name).toBe('Newer session');
    expect(result.current.session).toEqual(session2);
    expect(toast.success).not.toHaveBeenCalledWith('auth.profileUpdated');
  });

});
