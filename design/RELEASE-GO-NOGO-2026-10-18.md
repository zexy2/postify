# Postify — Go/No-Go for the approved redesign (18 Oct 2026)

**Decision: NO-GO for production cutover.** The existing website at `https://postify.zekiakgul.dev` is public and responded **HTTP 200** during this read-only audit. Its immutable `/release.json` reports source SHA `cba2c8652ca61d1dc559368e17a506061e0d4e95`, built **2026-09-28T11:51:09.575Z**. The redesigned source is on **isolated** Oracle worktree branch `chatgpt/ws-276e5f67e3ed`, initially at `a6a6f09048929632bd0b149ddbdb74caf779837e` for this audit, **64 commits ahead** of existing `main` with zero main-only commits. No new UI code was deployed to production and no remote Git operation was performed.

Do **not** confuse the existing live website with publication of the redesign. Do **not** equate mocked Playwright passes, a successful Git commit, or a passing production HTTP 200 with real Supabase authorization or complete launch readiness.

## Gate evidence (only verified facts)

| Mandatory release gate | Current evidence | Result |
| --- | --- | --- |
| Unit and normal user flows | Last tested source: **205/205 Vitest**, **60/60 Chromium**; lint, PWA build, build smoke, npm audit 0 known vulnerabilities. Report import is not independent commit proof. | Passing local tests; rerun in PR CI |
| **Full visual CI** | Ran the exact Playwright Visual configuration (one worker, 115 scenarios) without snapshot updates. **34 passed / 81 failed**; every failed case was `toHaveScreenshot`, **49 image dimension** mismatches and **32 pixel diffs**. This CI job is required before `deploy`. | **BLOCK — not green** |
| Design review / visual approval | Responsive dark/light baseline images in Home, Article, Admin, Auth, Editor and other routes differ. Earlier audits proved a subset of Admin and Bookmark mismatch geometry predated recent bug fixes, **not** that every one of 81 failures is benign. | Pending individual screenshot review and explicit baseline acceptance |
| Backend auth, RLS and content writes | Local mocked tests and PostgreSQL schema/RLS CI setup exist, but no **isolated staging Supabase project**, verified A/B test users, signed-in editor/admin flows or RLS CRUD proof for this new frontend release. | BLOCK until real nonproduction evidence |
| Current public backend capability | Production `knowledge-backend-status.json` responded 200 but reports `ready:false`, `mode:"supabase-schema-pending"` (artifact timestamp 2026-09-28). This is a **public artifact flag**, not independently proven remote schema truth. | Re-probe against authenticated **staging** and validate build/export path |
| Manual accessibility | 100/200/400% actual Chromium zoom + 8 bounded keyboard focus sequences (124 focus samples) passed; manual VoiceOver/NVDA, focus indicator contrast and protected full workflow WCAG 2.2 AA not signed off. | Pending |
| Mobile performance | Latest controlled Lighthouse mobile median around **57–59**; lab TBT ~600ms and large React/layout startup work. A tiny zero-scroll anchor optimization improved LCP slightly; field p75 LCP/INP/CLS not available. User-approved QA-03 makes performance a required acceptance gate. | Pending explicit release performance acceptance and repeatable target |
| Merge/publish authorization | No explicit current authorization to push, open release PR, merge to `main`, touch production DB, or deploy. Existing CI **automatically publishes GitHub Pages from `main`** after passing required gates and reading configured secrets. | BLOCK, separate owner signoff required |

## Exact CI and deployment semantics

`.github/workflows/ci.yml` runs required `verify`, Docker smoke, Chromium product E2E and **full visual snapshot** tests, plus an ephemeral PostgreSQL schema/RLS job. The `deploy` job depends on those checks and runs **only for pushes to `main`**, publishes the static `docs/` build to GitHub Pages, stamps `docs/release.json` with the source SHA, and then runs a production Chromium smoke job that waits for that exact SHA at the custom domain. Pushing to the isolated development branch alone is not equivalent to production deployment; **merging it into `main` triggers the automated production pipeline** (if required GitHub Secrets are configured).

Do **not** run `npm run deploy`, merge `main`, dispatch migration workflow with `apply`, or attempt any manual DB repair/rollback as a QA shortcut. The Supabase production migration workflow is separately dispatched and requires owner credentials plus an exact confirmation; normal front-end merge does not run database migrations. Leave the existing production database untouched until migration history, RLS, backup and release approval are verified.

## Bounded next steps, in order (no invented publication date)

1. **Visual acceptance:** inspect the 81 screenshot differences by route and severity; distinguish approved design changes from actual clipping, spacing, focus or semantic regressions. Present representative before/after screenshots for approval. Only then update accepted golden snapshots and re-run the **entire 115-case visual suite**. Do not update all images blindly or lower the `maxDiffPixelRatio` tolerance merely to get green.
2. **Nonproduction staging:** use a completely separate Supabase staging project with synthetic test accounts/data; verify signed-in A/B isolation, password/OAuth callbacks, signout/token-refresh/session rehydrate, profile/avatar/storage RLS, editor/admin/knowledge role CRUD, capabilities and no cross-account disclosure. Never reuse production data or share service-role credentials with browser code or the chat.
3. **Manual QA signoff:** check manual VoiceOver/NVDA focus/labels on all core routes, native 400% in authenticated editor/admin tasks, light/dark visual polish, and agree on the mandatory mobile performance budget. Do not claim real-user field p75 metrics without a production monitoring source.
4. **Exact-source preflight and release candidate:** run local security, unit, Chromium, full visual and schema/RLS checks on the proposed exact source SHA, then obtain an actual **green PR CI** run. Confirm GitHub Actions deploy secret names and protected environment settings through owner-controlled settings without exposing values. Snapshot current production release SHA, public assets, and intended rollback procedure.
5. **Explicit authorized cutover only:** after the user explicitly approves staging results and production publication, use the controlled PR/main merge, observe CI and SHA-attested production rollout, probe content/health/auth without touching user data, and stop/rollback the frontend if post-deploy smoke fails. A database schema rollback is **never** implied by a frontend revert.

The work above can proceed without an arbitrary calendar promise. Production publishing begins **only after** all mandatory evidence is green and the owner approves it. Do not silently relax QA-03 safety, WCAG 2.2 AA, data integrity or performance standards to claim an earlier launch.

## Safe local release inventory tool

`node scripts/qa/release-preflight.mjs --production --visual-report /tmp/playwright-visual.json --ui-report /tmp/playwright-ui.json --vitest-report /tmp/vitest.xml --json /tmp/postify-release-preflight.json`

This tool is **read-only except for an explicit JSON output under `/tmp`**. It reports branch/main divergence, CI deploy semantics, latest public release SHA and capability artifact, and external reporter counts. It intentionally exits code **2 / NO_GO** while visual, staging, manual QA, or owner-approval evidence remains pending, even when individual unit and UI reports pass. It never pushes, merges, triggers migrations or deploys. Reports supplied via flags are *not independently bound to a Git source commit*, and a passing tiny subset is rejected as a full visual test gate. Test the no-go behavior with `node --test scripts/qa/release-preflight.test.mjs`.

## Visual CI retest update — 2026-10-18

After six new non-screenshot Article/Author release layout checks were included, the CI-equivalent Chromium visual suite was rerun in full: **40/121 pass, 81/121 fail**, all 81 failures remain screenshot comparisons. The historical 34/115 figures above refer to the earlier configuration and are not the latest suite total. The exact source test report `ev-c6d90a4407b920a7bd69` remains a **failed release gate**. Staging, manual WCAG and owner deployment approval unchanged and still pending.
