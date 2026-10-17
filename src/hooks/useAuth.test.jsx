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

});
