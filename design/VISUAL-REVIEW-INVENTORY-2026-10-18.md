# Postify — Visual acceptance inventory (18 Oct 2026)

**Status: needs product owner acceptance, NO-GO until the entire CI visual suite is green.**

One complete Chromium visual regression run (the same test configuration used by `.github/workflows/ci.yml`) produced **115 cases, 34 passed, 81 image differences**. All 81 failed on screenshot comparison, not on the accompanying keyboard/interactivity asserts. Error text differentiates **49 dimension mismatch** failures from **32 pixel-level differences**. This does **not** imply every changed appearance is acceptable.

## Breakdown for human review

| Review area | Dimensions changed | Pixel-only differences | Total needs review |
| --- | ---: | ---: | ---: |
| Navigation / command palette | 0 | 2 | 2 |
| Home & discovery | 7 | 1 | 8 |
| Articles & authors | 4 | 10 | 14 |
| Editor | 6 | 0 | 6 |
| Knowledge tasks | 8 | 0 | 8 |
| Admin | 6 | 4 | 10 |
| Profiles & bookmarks | 10 | 0 | 10 |
| Auth / error states | 0 | 15 | 15 |
| About, contact, other | 8 | 0 | 8 |
| **TOTAL** | **49** | **32** | **81** |

Data source: Oracle full Playwright visual JSON `/tmp/postify-release-readiness-visual-full.json`, SHA-256 of parsed report `52ac50de1c5792e559805c4d11bcdad47218ac435228afb8202f683f630dd3bc`, evidence `ev-4d1020f08c1d2d8eae0b`. Read-only case inventory: `/tmp/postify-visual-inventory-20261018.json`. Failed expected/actual/diff PNGs (325 artifacts): `/tmp/postify-release-visual-review-20261018/`. This path is on the Oracle machine, not a public URL. No golden image or source screenshot was updated.

## First side-by-side visual review (sample, not full signoff)

Three representative screenshots were assembled into `/tmp/postify-release-visual-triage-20261018.jpg`, showing **old test expectation** on the left and **actual locally rendered redesigned UI** on the right:

- **Home desktop:** old light editorial hero versus new large dark-toned editorial cover, different headline position and feature composition. This is a **substantial intentional-looking design difference**, not a tiny antialiasing discrepancy. Confirm the dark cover is within the approved colour/hero design before accepting a new visual golden reference; do not infer signoff from the screenshot alone.
- **Article desktop:** typography and visual hierarchy broadly related, but title grid, summary panel and image position/spacing differ. Review against the approved inner-page composition and truncation/line-wrap behavior on mobile before refreshing.
- **Admin mobile:** headings, tabs and metric blocks remain structurally similar, with relatively small spacing and dimension deviations. Prior detached-source A/B already showed that a **subset** of Admin dashboard image-size differences existed before the latest focus fixes; that does not approve them automatically.

A reviewer must inspect all responsive light/dark variants and protected task states. Prior old/new A/B established preexisting baseline drift for four Admin and four Bookmark examples, **not the entire 81-case suite**. Classify each screenshot as `accepted-redesign`, `actual-bug`, `environment-font-rendering` (with evidence), or `unresolved`. Review critical clipping/legibility/action hit targets first, then approve only the actual expected changes. Run `npm run test:e2e:visual` on the final source **without changing snapshot tolerance**. A blanket `--update-snapshots` across all 81 cases **before review** is prohibited.

## Staging prerequisite discovered during review

GitHub repository environments currently list only **`github-pages`** and **`production`**. No separate `staging` environment is configured there; the Oracle process contains no `STAGING_SUPABASE_URL` or `STAGING_SUPABASE_ANON_KEY` environment names. This does not prove a separate Supabase project does not exist elsewhere, only that this run cannot identify/use one. To avoid reusing production, the new read-only `scripts/qa/staging-readiness.mjs` fails closed without an independently identified staging URL and publishable/anon key and explicitly refuses the production project ref. A public capabilities GET, if later explicitly enabled, **never** passes the protected OAuth/RLS/CRUD gate alone.

Next owner decision: first visually approve the intended new hero and overall editorial direction (not a blanket acceptance of all diffs); then provide or authorize creation of a **separate nonproduction Supabase project** through a secure owner-controlled environment configuration. Do not paste service-role keys into browser code/chat.

## Editorial Home direction approved by owner — 2026-10-18

**Owner decision:** Approved **dark editorial Home hero direction** after seeing side-by-side old light vs new dark desktop Home composition. This is recorded as CD-012 in `design/DESIGN-DECISIONS.md`.

The **4 full Home baseline screens** (`Home desktop`, `Home mobile`, `Dark theme Home desktop`, `Dark theme Home mobile`) are now classified as `direction-approved / exact pixels pending`. A separate light/dark **mobile** comparison at 390px confirmed the new large dark cover and prominent featured card in both themes: screenshot dimensions changed **3273→3862px** (mobile), and the desktop full-page dimensions changed **2790→3220px**. These large differences are not automatically judged harmless; inspect vertical rhythm, image distribution, focus states, body contrast, CTA accessibility and mobile performance before updating snapshots. The other four Home/discovery exceptions (no-results ×2, filter popover ×2) remain **unreviewed** because approval of the masthead does not approve filter/empty states.

**Approved concept guard:** `e2e/ui-v2.spec.js` tests the light/dark editorial hero in responsive 390/1440 viewports without masking pixel regressions. The four targeted checks were **4/4 PASS against a freshly rebuilt production bundle**. An initial 0/4 attempt had launched Playwright `preview` against stale tracked build assets; a separate direct-source Vite probe confirmed the CSS variables were correct and the rebuilt-production rerun passed. Future locally run `e2e/ui-v2.spec.js` must be preceded by `npm run build` or explicitly point to a current Vite development server; stale preview content must not be called a product bug. The precise existing Home golden PNGs have not been changed by this decision. The CI full visual gate remains **34/115 pass, 81/115 mismatch** until accepted assets are carefully reviewed and updated or implementation defects repaired. Do not pass off design-direction approval as publication approval.

### Final QA on approved direction (current isolated source)

The new responsive art-direction checks (4/4) run against a **freshly built**, exact-current-source production preview: correct dark Hero tokens for light and dark themes, WCAG contrast threshold for the hero H1, accessible search, functional featured link, ≥44px archive CTA and no document horizontal scroll at 390/1440. The entire **64/64 Chromium product E2E** suite passed, along with **205/205 Vitest**, **7/7 release/staging guard** tests, lint, PWA build and 0-known-vulnerability security audit. The test evidence is in Oracle and applies to the *local* source prior to the doc-only approval commit, not to production. The independent full visual snapshot suite has **not been rerun or rebaselined** after this decision; its last observed baseline remains 34/115 passed and 81 failed, unchanged by product code in this turn.
