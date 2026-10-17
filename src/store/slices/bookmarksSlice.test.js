import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it } from 'vitest';
import bookmarksReducer, {
  addBookmark, clearAllBookmarks, selectBookmarkedIds, selectBookmarkedPosts,
} from './bookmarksSlice';
import userReducer, { logout, setSession, setUser, setLoading } from './userSlice';

const makeStore = () => configureStore({ reducer: { bookmarks: bookmarksReducer, user: userReducer } });
const asAccount = (store, id) => {
  store.dispatch(setSession({ user: { id }, access_token: `${id}-token` }));
  store.dispatch(setUser({ id }));
  store.dispatch(setLoading(false));
};

describe('bookmarks identity boundaries', () => {
  it('keeps saved A items out of B and restores A on sign-in', () => {
    const store = makeStore();
    asAccount(store, 'account-a');
    store.dispatch(addBookmark({ id: 'a-book', postData: { id: 'a-book', title: 'Saved under A' }, scope: { kind: 'account', id: 'account-a' } }));
    expect(selectBookmarkedIds(store.getState())).toEqual(['a-book']);
    store.dispatch(logout());
    expect(selectBookmarkedIds(store.getState())).toEqual([]);
    asAccount(store, 'account-b');
    expect(selectBookmarkedIds(store.getState())).toEqual([]);
    expect(selectBookmarkedPosts(store.getState())).toEqual({});
    store.dispatch(addBookmark({ id: 'b-book', postData: { id: 'b-book', title: 'Saved under B' }, scope: { kind: 'account', id: 'account-b' } }));
    expect(selectBookmarkedIds(store.getState())).toEqual(['b-book']);
    store.dispatch(logout());
    asAccount(store, 'account-a');
    expect(selectBookmarkedIds(store.getState())).toEqual(['a-book']);
  });

  it('does not show guest bookmarks to a signed-in account or its unverified transition', () => {
    const store = makeStore();
    store.dispatch(setLoading(false));
    store.dispatch(addBookmark({ id: 'guest-only', postData: { id: 'guest-only', title: 'Guest saved' }, scope: { kind: 'guest' } }));
    expect(selectBookmarkedIds(store.getState())).toEqual(['guest-only']);
    store.dispatch(setLoading(true));
    expect(selectBookmarkedIds(store.getState())).toEqual([]);
    asAccount(store, 'account-a');
    expect(selectBookmarkedIds(store.getState())).toEqual([]);
    store.dispatch(logout());
    expect(selectBookmarkedIds(store.getState())).toEqual(['guest-only']);
  });

  it('clear current account does not touch a different account or unassigned archive', () => {
    const store = makeStore();
    asAccount(store, 'a');
    store.dispatch(addBookmark({ id: 'a', scope: { kind: 'account', id: 'a' } }));
    store.dispatch(logout());
    asAccount(store, 'b');
    store.dispatch(addBookmark({ id: 'b', scope: { kind: 'account', id: 'b' } }));
    store.dispatch(clearAllBookmarks({ scope: { kind: 'account', id: 'b' } }));
    expect(selectBookmarkedIds(store.getState())).toEqual([]);
    store.dispatch(logout());
    asAccount(store, 'a');
    expect(selectBookmarkedIds(store.getState())).toEqual(['a']);
  });
});
