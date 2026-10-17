import { createMigrate } from 'redux-persist';
import { describe, expect, it } from 'vitest';
import { migrateBookmarksV2 } from './bookmarkMigration';
import bookmarksReducer, {
  claimLegacyBookmarks, selectLegacyBookmarkCount, selectBookmarkedIds,
} from './slices/bookmarksSlice';
import userReducer, { setSession, setUser, setLoading } from './slices/userSlice';
import { configureStore } from '@reduxjs/toolkit';

const oldState = () => ({
  ui: { theme: 'dark' },
  bookmarks: {
    items: ['old-1', 'old-2'],
    posts: { 'old-1': { id: 'old-1', title: 'Archived title' }, 'old-2': { id: 'old-2', title: 'Another old title' } },
  },
  _persist: { version: 1, rehydrated: true },
});

describe('Redux persisted bookmark migration v1 -> v2', () => {
  it('quarantines complete legacy IDs and cached posts without associating an account or mutating source', async () => {
    const old = oldState();
    const migrated = await createMigrate({ 2: migrateBookmarksV2 }, { debug: false })(old, 2);
    expect(migrated.bookmarks.accounts).toEqual({});
    expect(migrated.bookmarks.guest).toEqual({ items: [], posts: {} });
    expect(migrated.bookmarks.legacyUnassigned).toEqual(old.bookmarks);
    expect(migrated.ui).toEqual(old.ui);
    expect(old.bookmarks.items).toEqual(['old-1', 'old-2']);
    expect(migrated._persist.version).toBe(1); // redux-persist updates version at REHYDRATE
  });

  it('keeps a migrated shelf unchanged on a second migration', () => {
    const first = migrateBookmarksV2(oldState());
    const second = migrateBookmarksV2(first);
    expect(second).toBe(first);
  });

  it('imports only on explicit claim, preserving existing account items and hiding archive from other accounts', () => {
    const saved = migrateBookmarksV2(oldState());
    const store = configureStore({
      reducer: { bookmarks: bookmarksReducer, user: userReducer },
      preloadedState: { bookmarks: saved.bookmarks },
    });
    const signIn = (id) => {
      store.dispatch(setSession({ user: { id } }));
      store.dispatch(setUser({ id }));
      store.dispatch(setLoading(false));
    };
    signIn('account-b');
    expect(selectBookmarkedIds(store.getState())).toEqual([]);
    expect(selectLegacyBookmarkCount(store.getState())).toBe(2);
    store.dispatch(claimLegacyBookmarks({ scope: { kind: 'account', id: 'account-b' } }));
    expect(selectBookmarkedIds(store.getState())).toEqual(['old-1', 'old-2']);
    expect(selectLegacyBookmarkCount(store.getState())).toBe(0);
    const migratedState = store.getState().bookmarks;
    expect(migratedState.accounts['account-b'].posts['old-1'].title).toBe('Archived title');
    expect(migratedState.legacyUnassigned).toEqual({ items: [], posts: {} });
    signIn('account-c');
    expect(selectBookmarkedIds(store.getState())).toEqual([]);
    expect(selectLegacyBookmarkCount(store.getState())).toBe(0);
  });

  it('preserves existing account metadata and historical orphan cache records while claiming', () => {
    const saved = migrateBookmarksV2(oldState());
    saved.bookmarks.accounts['account-a'] = {
      items: ['old-1', 'own'],
      posts: { 'old-1': { id: 'old-1', title: 'Account owner preferred' }, own: { id: 'own', title: 'Keep mine' } },
    };
    saved.bookmarks.legacyUnassigned.posts.orphan = { id: 'orphan', title: 'Historical orphan record' };
    const store = configureStore({
      reducer: { bookmarks: bookmarksReducer, user: userReducer },
      preloadedState: { bookmarks: saved.bookmarks },
    });
    store.dispatch(claimLegacyBookmarks({ scope: { kind: 'account', id: 'account-a' } }));
    const account = store.getState().bookmarks.accounts['account-a'];
    expect(account.items).toEqual(['old-1', 'own', 'old-2']);
    expect(account.posts['old-1'].title).toBe('Account owner preferred');
    expect(account.posts.own.title).toBe('Keep mine');
    expect(account.posts.orphan.title).toBe('Historical orphan record');
    expect(store.getState().bookmarks.legacyUnassigned.items).toEqual([]);
  });

  it('never lets the anonymous user claim the legacy archive', () => {
    const saved = migrateBookmarksV2(oldState());
    const store = configureStore({
      reducer: { bookmarks: bookmarksReducer, user: userReducer },
      preloadedState: { bookmarks: saved.bookmarks },
    });
    store.dispatch(setLoading(false));
    store.dispatch(claimLegacyBookmarks({ scope: { kind: 'guest' } }));
    expect(store.getState().bookmarks.legacyUnassigned.items).toHaveLength(2);
    expect(selectBookmarkedIds(store.getState())).toEqual([]);
    expect(selectLegacyBookmarkCount(store.getState())).toBe(0);
  });
});
