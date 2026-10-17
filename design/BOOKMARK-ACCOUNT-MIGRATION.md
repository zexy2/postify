# Account-scoped bookmarks and legacy device migration — 2026-10-18

## Approved behavior

The previously global Redux Persist bookmark state mixed accounts on the same browser. For a verified authenticated subject (matching `user.id`, `session.user.id` and `isAuthenticated`), bookmarked items/posts are now stored and read only from `bookmarks.accounts[subjectId]`. During authentication loading, session mismatch or verification failure, no shelf is exposed. Signed-out visitors may still save to a separate `guest` shelf; guest saves do **not** appear inside authenticated account shelves or transfer on login. Actions captured in a previous user/account render are rejected if the identity changes before invocation. Clearing a shelf affects only that shelf.

`src/store/index.js` bumps root persistence from version 1 to version 2 and registers `migrateBookmarksV2` through `createMigrate`. The old unowned `bookmarks.items` and `bookmarks.posts` are **copied intact** to `bookmarks.legacyUnassigned`. No owner is inferred from the current browser session, and account/guest buckets start empty. The migration preserves other persisted root state and is idempotent. Tests cover the actual `redux-persist` rehydration from a serialized v1 record, preservation of IDs and cached data, and unaffected account/guest selectors. A post ID with no cached metadata is still displayed in the account shelf with a neutral placeholder instead of disappearing.

On the protected `/bookmarks` route, a legacy recovery notice appears if the archive is nonempty. It states the records may be from a different person on the same device. Import requires **two deliberate actions**: checking the ownership acknowledgment and clicking **Bu hesaba aktar / Import into this account**. Only then are all legacy IDs and cached records merged into the currently verified account without replacing existing account metadata; the archive is cleared after successful transfer, never on login. The acknowledgment resets across account identity changes. The importer cannot run under a guest or unresolved session. The recorded account key is a local device storage partition, not a claim of server-side ownership or an encrypted storage boundary.

## QA evidence and limitations

- RED then GREEN: save under A -> logout -> sign in B, guest isolation, per-account clear, old-account closure firing after switching to B. A's shelf remains available after switching back.
- Persisted version 1 migration and v2 idempotence, overlapping IDs, orphan cache retention, and no automatic or anonymous claiming.
- UI acknowledgment and import tests, plus Chromium functional tests at 320px and 1440px, verified actual interactive behavior (not staging Supabase login).
- Existing visual reference snapshots for bookmarks empty/populated differed during the optional screenshot baseline run. **Do not update screenshots automatically or claim visual acceptance** without reviewing baseline drift; functional browser import tests passed separately.
- Data remains **local to this browser**. This does not provide encryption, secure shared-device isolation against local storage inspection, account synchronization across devices, or Supabase RLS authorization. Do not represent this as a server-side security boundary.
- No production data migration has been executed: only app source and isolated test fixtures were changed. No push or deployment was authorized or performed.

## Local final regression outcome

Final Node24 job `job-750a0a5f179d` (exit 0): **203/203 Vitest tests**, **60/60 Chromium UI E2E**, lint, PWA production build, build smoke (11 critical artifacts; 314022-byte main entry below 320000-byte budget), and security dependency audit (0 known vulnerabilities) passed. Separate Chromium functional legacy-import verification passed **2/2** at 320px and 1440px. Importing the JUnit/JSON reports into Oracle preserves these parsed results; importing them is not execution.

The optional preexisting visual snapshot comparison run showed **4 baseline image mismatches**, and its first two import tests used a hardcoded TR-only locator while the browser was in EN; those two tests were corrected and separately passed. Existing baseline images were deliberately not overwritten. A build-time runtime-status recheck-required warning for a Node 24 patch version transition remains a separate release gate, not a failure of the automated dependency audit.
