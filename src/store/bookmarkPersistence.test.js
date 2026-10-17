import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createMigrate, persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { describe, expect, it, vi } from 'vitest';
import bookmarksReducer, { selectBookmarkedIds } from './slices/bookmarksSlice';
import userReducer, { setSession, setUser, setLoading } from './slices/userSlice';
import { migrateBookmarksV2 } from './bookmarkMigration';

const load = async (serialized) => {
  const storage = {
    getItem: vi.fn(async () => serialized),
    setItem: vi.fn(async () => undefined),
    removeItem: vi.fn(async () => undefined),
  };
  const reducer = persistReducer({
    key: 'postify_root', version: 2, storage, whitelist: ['bookmarks'],
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
  return { store, persistor, storage };
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
