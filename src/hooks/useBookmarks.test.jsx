/**
 * useBookmarks Hook Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import bookmarksReducer from '../store/slices/bookmarksSlice';
import userReducer, { logout, setLoading, setSession, setUser } from '../store/slices/userSlice';
import { useBookmarks } from './useBookmarks';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
  },
}));

const createTestStore = () => {
  return configureStore({
    reducer: {
      bookmarks: bookmarksReducer,
    },
  });
};

const wrapper = ({ children }) => (
  <Provider store={createTestStore()}>{children}</Provider>
);

describe('useBookmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('binds bookmark commands to the verified owner displayed by the current render', () => {
    const store = configureStore({
      reducer: { bookmarks: bookmarksReducer, user: userReducer },
    });
    const ownerWrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
    const { result } = renderHook(() => useBookmarks(), { wrapper: ownerWrapper });
    expect(result.current.bookmarksCount).toBe(0);

    act(() => {
      store.dispatch(setLoading(false));
      store.dispatch(setSession({ user: { id: 'account-a' } }));
      store.dispatch(setUser({ id: 'account-a' }));
    });
    act(() => { result.current.add('a-article', { id: 'a-article', title: 'A bookmark' }); });
    expect(result.current.bookmarkedIds).toEqual(['a-article']);
    expect(result.current.accountId).toBe('account-a');

    act(() => {
      store.dispatch(logout());
      store.dispatch(setSession({ user: { id: 'account-b' } }));
      store.dispatch(setUser({ id: 'account-b' }));
    });
    act(() => { result.current.add('b-article', { id: 'b-article', title: 'B bookmark' }); });
    expect(result.current.bookmarkedIds).toEqual(['b-article']);
    expect(result.current.accountId).toBe('account-b');

    act(() => {
      store.dispatch(logout());
      store.dispatch(setSession({ user: { id: 'account-a' } }));
      store.dispatch(setUser({ id: 'account-a' }));
    });
    expect(result.current.bookmarkedIds).toEqual(['a-article']);
    expect(result.current.bookmarksCount).toBe(1);
  });

  it('ignores bookmark clicks captured by a previous account after A-to-B transition', () => {
    const store = configureStore({ reducer: { bookmarks: bookmarksReducer, user: userReducer } });
    const ownerWrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
    const { result } = renderHook(() => useBookmarks(), { wrapper: ownerWrapper });

    act(() => {
      store.dispatch(setSession({ user: { id: 'account-a' } }));
      store.dispatch(setUser({ id: 'account-a' }));
      store.dispatch(setLoading(false));
    });
    const oldAccountToggle = result.current.toggle;
    act(() => {
      store.dispatch(logout());
      store.dispatch(setSession({ user: { id: 'account-b' } }));
      store.dispatch(setUser({ id: 'account-b' }));
      oldAccountToggle('old-a-private-post', { id: 'old-a-private-post' });
    });
    expect(result.current.accountId).toBe('account-b');
    expect(result.current.bookmarkedIds).toEqual([]);
  });

  it('keeps saved IDs visible when their historical cached post metadata is missing', () => {
    const store = createTestStore();
    const localWrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
    const { result } = renderHook(() => useBookmarks(), { wrapper: localWrapper });
    act(() => { result.current.add('uncached-id'); });
    expect(result.current.bookmarkedIds).toEqual(['uncached-id']);
    expect(result.current.bookmarkedPosts).toHaveLength(1);
    expect(result.current.bookmarkedPosts[0].id).toBe('uncached-id');
    expect(result.current.bookmarkedPosts[0].title).toMatch(/Kaydedilmiş içerik|Saved article/);
  });

  it('should return empty bookmarks initially', () => {
    const { result } = renderHook(() => useBookmarks(), { wrapper });

    expect(result.current.bookmarkedIds).toEqual([]);
    expect(result.current.bookmarksCount).toBe(0);
  });

  it('should check if post is bookmarked', () => {
    const { result } = renderHook(() => useBookmarks(), { wrapper });

    expect(result.current.isBookmarked(1)).toBe(false);
  });

  it('should add bookmark', () => {
    const store = createTestStore();
    const customWrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useBookmarks(), { wrapper: customWrapper });

    act(() => {
      result.current.add(1, { id: 1, title: 'Test Post' });
    });

    expect(result.current.isBookmarked(1)).toBe(true);
    expect(result.current.bookmarksCount).toBe(1);
  });

  it('should remove bookmark', () => {
    const store = createTestStore();
    const customWrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useBookmarks(), { wrapper: customWrapper });

    act(() => {
      result.current.add(1, { id: 1, title: 'Test Post' });
    });

    expect(result.current.isBookmarked(1)).toBe(true);

    act(() => {
      result.current.remove(1);
    });

    expect(result.current.isBookmarked(1)).toBe(false);
    expect(result.current.bookmarksCount).toBe(0);
  });

  it('should toggle bookmark', () => {
    const store = createTestStore();
    const customWrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useBookmarks(), { wrapper: customWrapper });

    // Toggle on
    act(() => {
      result.current.toggle(1, { id: 1, title: 'Test Post' });
    });
    expect(result.current.isBookmarked(1)).toBe(true);

    // Toggle off
    act(() => {
      result.current.toggle(1);
    });
    expect(result.current.isBookmarked(1)).toBe(false);
  });

  it('should clear all bookmarks', () => {
    const store = createTestStore();
    const customWrapper = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useBookmarks(), { wrapper: customWrapper });

    act(() => {
      result.current.add(1, { id: 1, title: 'Test 1' });
      result.current.add(2, { id: 2, title: 'Test 2' });
    });

    expect(result.current.bookmarksCount).toBe(2);

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.bookmarksCount).toBe(0);
  });
});
