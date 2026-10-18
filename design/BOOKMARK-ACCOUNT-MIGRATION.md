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

## 2026-10-18 — Historical visual A/B and enlarged text reflow

To separate visual reference drift from the account-shelf migration, four screenshot comparisons were run from **detached, read-only old `7743e51`** source in a temporary directory, and their results were compared with the current `96cbee0` screenshot baseline attempt. The four snapshot mismatches were *already present* on the older code and showed exactly the same expected→actual dimensions in both source versions:

| Snapshot | Expected | Older 7743e51 actual | 96cbee0 actual |
| --- | --- | --- | --- |
| Empty bookmarks, desktop | 1440×700 | 1440×620 | 1440×620 |
| Empty bookmarks, mobile | 390×591 | 390×422 | 390×422 |
| Populated bookmarks, desktop | 1440×814 | 1440×746 | 1440×746 |
| Populated bookmarks, mobile | 390×1052 | 390×1098 | 390×1098 |

This supports **pre-existing baseline drift, not a newly introduced screenshot-size regression caused by bookmark scoping**. Exact pixel-level design acceptance still requires separate review; no reference images were changed.

An extra 320px browser regression applying `html { font-size: 200% !important; }` to the legacy import screen originally found the empty shelf grid’s intrinsic sizing forced heading/panel/CTA outside the 320px viewport (button right edge ≈447px). CSS fixed the empty grid track with `minmax(0,1fr)`, allowed contained children to wrap, and bounded both the import and back actions. Targeted Chromium regression checks keyboard focus, Space checkbox, Enter to import, 44px button height and no off-viewport button/scroll overflow. **Three of three browser cases passed after the fix**. This is browser CSS font-size enlargement and is **not** native browser 200%/400% zoom or full assistive-technology WCAG certification.

A new end-to-end in-memory `redux-persist` adapter test serializes A, B and guest bookmarks to the actual v2 persisted JSON, fully restarts a store, confirms each account’s shelf is restored only when that account is verified, and confirms guest isolation. Targeted test passed; the overall QA suite includes it.
