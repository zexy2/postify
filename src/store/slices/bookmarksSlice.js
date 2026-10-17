/** Local-only bookmark shelves. Account identity is never inferred from legacy data. */
import { createSlice } from '@reduxjs/toolkit';

const EMPTY_IDS = Object.freeze([]);
const EMPTY_POSTS = Object.freeze({});
const freshShelf = () => ({ items: [], posts: {} });

const initialState = {
  accounts: {},
  guest: freshShelf(),
  // v1 bookmarks had no owner; preserve them until an authenticated user
  // explicitly chooses to import on this device.
  legacyUnassigned: freshShelf(),
};

/** Fail closed while auth is unresolved or user and session disagree. */
export function getBookmarkScope(root) {
  const auth = root.user;
  if (!auth) return { kind: 'guest' }; // standalone hook/unit fixtures
  const id = auth.user?.id;
  if (auth.isAuthenticated && id && auth.session?.user?.id === id) {
    return { kind: 'account', id };
  }
  if (auth.isLoading || auth.isAuthenticated || id || auth.session) return null;
  return { kind: 'guest' };
}

const validScope = (scope) => scope?.kind === 'guest' ||
  (scope?.kind === 'account' && typeof scope.id === 'string' && Boolean(scope.id));

const readShelf = (state, scope) => {
  if (!validScope(scope)) return null;
  return scope.kind === 'guest' ? state.guest : state.accounts?.[scope.id];
};

const writableShelf = (state, scope) => {
  if (!validScope(scope)) return null;
  if (scope.kind === 'guest') return state.guest;
  state.accounts[scope.id] ??= freshShelf();
  return state.accounts[scope.id];
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    toggleBookmark: (state, action) => {
      const { id, postData, scope } = action.payload || {};
      const shelf = writableShelf(state, scope);
      if (!shelf || id == null) return;
      const index = shelf.items.indexOf(id);
      if (index === -1) {
        shelf.items.push(id);
        if (postData) shelf.posts[id] = postData;
      } else {
        shelf.items.splice(index, 1);
        delete shelf.posts[id];
      }
    },
    addBookmark: (state, action) => {
      const { id, postData, scope } = action.payload || {};
      const shelf = writableShelf(state, scope);
      if (!shelf || id == null || shelf.items.includes(id)) return;
      shelf.items.push(id);
      if (postData) shelf.posts[id] = postData;
    },
    removeBookmark: (state, action) => {
      const { id, scope } = action.payload || {};
      const shelf = writableShelf(state, scope);
      if (!shelf) return;
      shelf.items = shelf.items.filter((itemId) => itemId !== id);
      delete shelf.posts[id];
    },
    clearAllBookmarks: (state, action) => {
      const shelf = writableShelf(state, action.payload?.scope);
      if (!shelf) return;
      shelf.items = [];
      shelf.posts = {};
    },
    claimLegacyBookmarks: (state, action) => {
      const scope = action.payload?.scope;
      // UI import is a separate, explicit user action. Never transfer legacy
      // bookmarks on login, account refresh or redux-persist rehydration.
      if (scope?.kind !== 'account' || !validScope(scope)) return;
      const target = writableShelf(state, scope);
      const legacy = state.legacyUnassigned;
      for (const id of legacy.items) {
        if (!target.items.includes(id)) target.items.push(id);
      }
      // Keep even orphaned historical cache entries. Legacy device data may
      // contain cached posts without an ID in items after older app failures.
      for (const [id, post] of Object.entries(legacy.posts)) {
        if (!target.posts[id]) target.posts[id] = post;
      }
      // Every legacy record is preserved in the explicitly selected shelf.
      state.legacyUnassigned = freshShelf();
    },
  },
});

export const {
  toggleBookmark, addBookmark, removeBookmark, clearAllBookmarks, claimLegacyBookmarks,
} = bookmarksSlice.actions;

const selectScopeShelf = (root) => readShelf(root.bookmarks, getBookmarkScope(root));
export const selectBookmarkedIds = (root) => selectScopeShelf(root)?.items ?? EMPTY_IDS;
export const selectBookmarkedPosts = (root) => selectScopeShelf(root)?.posts ?? EMPTY_POSTS;
export const selectIsBookmarked = (id) => (root) => selectBookmarkedIds(root).includes(id);
export const selectBookmarksCount = (root) => selectBookmarkedIds(root).length;
export const selectLegacyBookmarkCount = (root) =>
  getBookmarkScope(root)?.kind === 'account' ? root.bookmarks.legacyUnassigned?.items?.length ?? 0 : 0;

export default bookmarksSlice.reducer;
