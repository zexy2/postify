# Editor and Knowledge release QA — 18 October 2026

Scope: local, isolated Oracle `run-96210d9920c1` worktree. This is **not** a staging authentication/RLS approval, visual design acceptance, or production authorization.

## Historic reference images

The following **14/14** legacy desktop/mobile baseline cases failed solely at `toHaveScreenshot` after their preceding assertions passed: Editor (2), Edit Knowledge (2), authenticated profile editor (2), Knowledge unavailable (2), Knowledge health (2), dark Editor (2), and dark Knowledge health (2). This confirms unmatched historic reference images, **not** 14 known product behavior defects. No screenshots were replaced or updated. Read-only Playwright report: `/tmp/postify-editor-knowledge-baselines-20261018.json`; Oracle evidence `ev-c46451ae752e74b1daf1` (14 failed screenshots).

## Independent behavior gate

Added `e2e/visual/knowledge-release-contract.spec.js`, using only local Vite/React fixture routes (`knowledge-auth.html`, `knowledge-unavailable.html`):

- Maintenance light/dark at 320, 390, 820 and 1440 CSS px (8 scenarios): heading/three queue records, edit/reverify hit target heights, active vs disabled re-verification when meaningful evidence is absent, correct edit-route destination, keyboard focus and horizontal overflow.
- Unavailable-state recovery at 320, 820 and 1440 CSS px (3 scenarios): visible heading, two navigation routes, 44px targets and no document overflow.
- Initial actual test was **9/11 PASS**. The light/dark 1440px cases proved the desktop Knowledge maintenance actions only 38px high; mobile/tablet had existing 44px media overrides.
- Only production code edit: `src/pages/KnowledgeDashboardPage/KnowledgeDashboardPage.module.css` moves `.actions a` / `.actions button` minimum height to **44px for all widths**, deleting redundant media overrides. It does not alter evidence state, authentication, network calls, reverify business rules or database records.
- Exact targeted rerun **11/11 PASS** (0 failed, 0 skipped, 0 flaky) on fixture routes. RED Oracle `ev-2b92ea02ed990b066b44` (SHA-256 `a08f0690e117b37a88e18c07849f541497f5cd2b115e416a7827b2ae95daa3e5`); GREEN Oracle `ev-58fd24a0176ae6f1f886` (SHA-256 `91d11403cb1baf39f27d357f585079093ca201ab4c9a6667f14e20acafe8eb3b`). Report import only parses real executed Playwright JSON, does not independently certify behavior.

## Open gates

- All 14 relevant old pixel snapshots require **individual** visual review / owner acceptance. Do not blindly regenerate.
- No real nonproduction Supabase test account has been used to validate OAuth session/refresh, editor CRUD, knowledge re-verification or per-actor RLS; mock/fixture passes do not prove those.
- Assistive-technology/manual WCAG 2.2 AA, true native zoom, production-like mobile performance/p75 field CWV, exact-release-SHA CI, and owner approval for any push/merge/deployment remain outstanding.
- About/Contact Studio direction remains a proposed design awaiting explicit owner review; `devam` is not acceptance.

Reproduce focused behavior test: `npx playwright test -c playwright.visual.config.js e2e/visual/knowledge-release-contract.spec.js` (set an unused `PLAYWRIGHT_VISUAL_PORT` if needed). No production data or live provider credentials should be configured for these fixture checks.

## Local post-fix wider regression and build freshness finding

- Node 22 runner (not repository-required Node 24): **205/205 Vitest** (`ev-fe3503dc93443ef5043c`); **7/7** release guard tests, ESLint and npm audit security PASS. New focused 11/11 behavior PASS remains separate.
- Initial full product Chromium **7/64** (`ev-c4f8e9c587cf58107e06`) accidentally tested a *stale tracked Vite `docs/` build* rather than current source. That build file `docs/index.html` was last committed at `cba2c86`, whereas the source is on a newer isolated development branch; the local Playwright config starts `vite preview` against `docs/`. Failures across unrelated Home/auth/navigation screens showed outdated UI. It is **not** evidence of 57 source regressions.
- Rebuilt the current local source using **direct `npx vite build`** (did **not** run Node 24 `prebuild`/knowledge generation). The independent `npm run smoke:build` then passed 11 critical assets and the 314094/320000-byte entry budget. Repeated the identical complete Chromium suite on isolated port 4192: **64/64 PASS, 0 flaky, 0 skipped**, report `ev-675c5b472205160dc22e`, SHA-256 `5d3e786f2d5f480c566ac74dfeee6057040299ec0acbd2e098d8cefa62ed80a7`. This establishes correct local-source browser behavior, **not** full Node 24 CI/release equivalence.
- Product E2E must always run against a **fresh build of the exact candidate SHA**. A bare `preview` with stale tracked `docs/` can generate misleading failures. Full release still requires Node 24 prebuild and all mandatory visual/staging/performance gates before cutover.
