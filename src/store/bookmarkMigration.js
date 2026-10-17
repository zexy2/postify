/** v1 persisted one shared shelf with no owner information. Preserve it. */
export function migrateBookmarksV2(persisted) {
  if (!persisted?.bookmarks || typeof persisted.bookmarks !== 'object') return persisted;
  const old = persisted.bookmarks;
  if (old.accounts && old.guest && old.legacyUnassigned) return persisted;
  return {
    ...persisted,
    bookmarks: {
      accounts: old.accounts || {},
      guest: old.guest || { items: [], posts: {} },
      legacyUnassigned: old.legacyUnassigned || {
        items: Array.isArray(old.items) ? old.items : [],
        posts: old.posts && typeof old.posts === 'object' ? old.posts : {},
      },
    },
  };
}
