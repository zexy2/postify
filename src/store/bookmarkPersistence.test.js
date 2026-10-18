import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createMigrate, persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { describe, expect, it, vi } from 'vitest';
import bookmarksReducer, { addBookmark, selectBookmarkedIds, selectLegacyBookmarkCount } from './slices/bookmarksSlice';
import userReducer, { logout, setSession, setUser, setLoading } from './slices/userSlice';
import { migrateBookmarksV2 } from './bookmarkMigration';

const load = async (serialized, sharedStorage = null) => {
  const storage = {
    getItem: vi.fn(async () => serialized),
    setItem: vi.fn(async () => undefined),
    removeItem: vi.fn(async () => undefined),
  };
  const adapter = sharedStorage || storage;
  const reducer = persistReducer({
    key: 'postify_root', version: 2, storage: adapter, whitelist: ['bookmarks'],
    migrate: createMigrate({ 2: migrateBookmarksV2 }),
  }, combineReducers({ bookmarks: bookmarksReducer, user: userReducer }));
  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    } }),
  });
  const persistor = await new Promise((resolve) => {
    const instance = persistStore(store, null, () => resolve(instance));
  });
  return { store, persistor, storage: adapter };
};

describe('actual redux-persist v1 bookmark rehydration', () => {
  it('loads old device records into unassigned archive, not A or B', async () => {
    const storageRecord = JSON.stringify({
      bookmarks: JSON.stringify({ items: ['legacy-1'], posts: {
        'legacy-1': { id: 'legacy-1', title: 'Old selection' },
      } }),
      _persist: JSON.stringify({ version: 1, rehydrated: true }),
    });
    const { store, persistor } = await load(storageRecord);
    const snapshot = store.getState();
    expect(snapshot._persist.version).toBe(2);
    expect(snapshot.bookmarks.legacyUnassigned.items).toEqual(['legacy-1']);
    expect(snapshot.bookmarks.legacyUnassigned.posts['legacy-1'].title).toBe('Old selection');
    expect(selectBookmarkedIds(snapshot)).toEqual([]);
    store.dispatch(setSession({ user: { id: 'account-b' } }));
    store.dispatch(setUser({ id: 'account-b' }));
    store.dispatch(setLoading(false));
    expect(selectBookmarkedIds(store.getState())).toEqual([]);
    expect(store.getState().bookmarks.legacyUnassigned.items).toEqual(['legacy-1']);
    await persistor.flush();
    expect(persistor.getState().bootstrapped).toBe(true);
  });
});


describe('actual redux-persist v2 account and guest storage round trip', () => {
  it('stores A/B and guest independently across a full rehydrate without reassigning ownership', async () => {
    const memory = new Map();
    const storage = {
      getItem: vi.fn(async (key) => memory.get(key) ?? null),
      setItem: vi.fn(async (key, value) => { memory.set(key, value); }),
      removeItem: vi.fn(async (key) => { memory.delete(key); }),
    };
    const first = await load(null, storage);
    const firstStore = first.store;
    firstStore.dispatch(setLoading(false));
    firstStore.dispatch(addBookmark({ id: 'guest-record', postData: { id: 'guest-record', title: 'Guest only' }, scope: { kind: 'guest' } }));

    const signIn = (store, id) => {
      store.dispatch(setSession({ user: { id, access_token: `token-${id}` } }));
      store.dispatch(setUser({ id }));
      store.dispatch(setLoading(false));
    };
    signIn(firstStore, 'account-a');
    firstStore.dispatch(addBookmark({ id: 'a-record', postData: { id: 'a-record', title: 'A private' }, scope: { kind: 'account', id: 'account-a' } }));
    signIn(firstStore, 'account-b');
    firstStore.dispatch(addBookmark({ id: 'b-record', postData: { id: 'b-record', title: 'B private' }, scope: { kind: 'account', id: 'account-b' } }));
    await first.persistor.flush();
    const encoded = memory.get('persist:postify_root');
    expect(encoded).toBeTruthy();
    const record = JSON.parse(JSON.parse(encoded).bookmarks);
    expect(record.accounts['account-a'].items).toEqual(['a-record']);
    expect(record.accounts['account-b'].items).toEqual(['b-record']);
    expect(record.guest.items).toEqual(['guest-record']);
    first.persistor.pause();

    const next = await load(null, storage);
    const nextStore = next.store;
    expect(nextStore.getState()._persist.version).toBe(2);
    expect(selectBookmarkedIds(nextStore.getState())).toEqual([]);
    signIn(nextStore, 'account-b');
    expect(selectBookmarkedIds(nextStore.getState())).toEqual(['b-record']);
    nextStore.dispatch(logout());
    expect(selectBookmarkedIds(nextStore.getState())).toEqual(['guest-record']);
    signIn(nextStore, 'account-a');
    expect(selectBookmarkedIds(nextStore.getState())).toEqual(['a-record']);
    expect(selectLegacyBookmarkCount(nextStore.getState())).toBe(0);
    next.persistor.pause();
  });
});
