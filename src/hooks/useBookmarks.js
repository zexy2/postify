/** Device-local bookmarks, isolated by verified account or signed-out guest. */
import { useDispatch, useSelector, useStore } from 'react-redux';
import { useCallback, useMemo } from 'react';
import {
  toggleBookmark, addBookmark, removeBookmark, clearAllBookmarks,
  claimLegacyBookmarks, getBookmarkScope, selectBookmarkedIds,
  selectBookmarkedPosts, selectLegacyBookmarkCount,
} from '../store/slices/bookmarksSlice';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export function useBookmarks() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const store = useStore();
  const bookmarkedIds = useSelector(selectBookmarkedIds);
  const bookmarkedPosts = useSelector(selectBookmarkedPosts);
  const legacyCount = useSelector(selectLegacyBookmarkCount);
  const renderedScopeKey = useSelector((root) => {
    const scope = getBookmarkScope(root);
    return scope?.kind === 'account' ? `account:${scope.id}` : scope?.kind === 'guest' ? 'guest' : null;
  });
  const accountId = renderedScopeKey?.startsWith('account:') ? renderedScopeKey.slice(8) : null;

  // Reject handlers from a previous account (or guest render), even if they
  // fire after Redux switches identities but before React replaces the UI.
  const currentScope = useCallback(() => {
    const scope = getBookmarkScope(store.getState());
    const key = scope?.kind === 'account' ? `account:${scope.id}` : scope?.kind === 'guest' ? 'guest' : null;
    return key === renderedScopeKey ? scope : null;
  }, [renderedScopeKey, store]);
  const isBookmarked = useCallback((id) => bookmarkedIds.includes(id), [bookmarkedIds]);

  const toggle = useCallback((id, postData = null) => {
    const scope = currentScope();
    if (!scope) return;
    const wasBookmarked = selectBookmarkedIds(store.getState()).includes(id);
    dispatch(toggleBookmark({ id, postData, scope }));
    toast.success(t(wasBookmarked ? 'success.bookmarkRemoved' : 'success.bookmarkAdded'));
  }, [currentScope, dispatch, store, t]);

  const add = useCallback((id, postData = null) => {
    const scope = currentScope();
    if (!scope || selectBookmarkedIds(store.getState()).includes(id)) return;
    dispatch(addBookmark({ id, postData, scope }));
    toast.success(t('success.bookmarkAdded'));
  }, [currentScope, dispatch, store, t]);

  const remove = useCallback((id) => {
    const scope = currentScope();
    if (!scope) return;
    dispatch(removeBookmark({ id, scope }));
    toast.success(t('success.bookmarkRemoved'));
  }, [currentScope, dispatch, t]);

  const clearAll = useCallback(() => {
    const scope = currentScope();
    if (!scope) return;
    dispatch(clearAllBookmarks({ scope }));
    toast.success(t('bookmarks.clearAll'));
  }, [currentScope, dispatch, t]);

  const importLegacy = useCallback(() => {
    const scope = currentScope();
    if (scope?.kind !== 'account' || !selectLegacyBookmarkCount(store.getState())) return false;
    dispatch(claimLegacyBookmarks({ scope }));
    return true;
  }, [currentScope, dispatch, store]);

  const bookmarkedPostsList = useMemo(() => bookmarkedIds.map((id) => bookmarkedPosts[id] || {
    id,
    title: i18n.language?.startsWith('en') ? 'Saved article (details not cached)' : 'Kaydedilmiş içerik (ayrıntılar önbellekte yok)',
  }), [bookmarkedIds, bookmarkedPosts, i18n.language]);

  return {
    bookmarkedIds,
    bookmarkedPosts: bookmarkedPostsList,
    bookmarksCount: bookmarkedIds.length,
    legacyCount,
    accountId,
    importLegacy,
    isBookmarked,
    toggle,
    add,
    remove,
    clearAll,
  };
}
