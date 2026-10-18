# Postify Known Issues

## Current — release relevant
- **Canonical-source production migration cannot currently be applied by automation because GitHub Actions has no `SUPABASE_ACCESS_TOKEN` or `SUPABASE_DB_PASSWORD` secret configured.** Migration `20260829231500_canonical_source_url.sql` is additive, passes the full PostgreSQL 16 migration/RLS chain, and the frontend is capability-gated so production remains safe and the field stays hidden until the schema capability appears.
- **Supabase Auth leaked-password protection is disabled.** Database/RLS migration is healthy; this separate Auth setting still needs to be enabled from Supabase Auth configuration because the connected management surface does not expose that toggle.
- **GitHub Pages direct SPA paths return an initial HTTP 404 by hosting design.** The checked `404.html` redirect restores the route in browsers. Chromium E2E covers direct article navigation; HTTP-only probes must not mislabel the expected initial 404 as an application rendering failure.
- **Automatic Postify verification intentionally supports only checked-in deterministic Node.js snippets.** Arbitrary user code, package installation, shell/network access and external-service verification remain unsupported until an isolated runtime is designed.
- **Browserslist/caniuse-lite data is ~8 months old.** This is a maintenance warning, not a current release blocker.
- The Oracle host has no global Node/npm runtime; deterministic release checks use pinned Docker images.

## Resolved — 2026-08-29
- Deterministic screenshot-diff baselines are committed for Home, Article, and Editor at 1440px and 390px. The Playwright 1.57 visual suite is now a required Chromium CI step, so unintended visual drift blocks the main release before deploy.

## Resolved — 2026-08-28
- Editor trust state no longer conflates publishability, writing quality, and evidence: publication eligibility matches the submit contract, `Author tested` requires meaningful evidence in both frontend and production DB paths, and future/same-day test-date handling is aligned with the database integrity trigger.
- Automatic Node verification no longer runs on the EOL Node 20 line; hosted verification/deploy uses Node 24.20.0, the manifest rejects non-Node-24 execution, and a daily official Node release signal withholds the current Verified badge when a newer LTS release appears or freshness cannot be established. Package/dependency-level evidence invalidation remains a separate backlog item.
- Dependency regressions are now release-blocking: CI fails closed if npm audit reports any vulnerability or is unavailable, and also blocks Playwright package/container version drift. Dependabot routine version PRs are limited to minor/patch updates; major upgrades require deliberate review.
- Dependency lock security baseline is clean: independent npm audit reports 0 production and 0 full-tree vulnerabilities after a minimal non-force lock remediation; weekly Dependabot version monitoring is configured separately from urgent security updates.
- Authenticated Verified Knowledge RPCs no longer execute as exposed SECURITY DEFINER functions; public wrappers are SECURITY INVOKER and privileged helpers live in the non-exposed `private` schema. Supabase security advisor now reports only the separate leaked-password-protection Auth warning.
- Production knowledge export no longer leaves stale fallback-only JSON behind after a successful Supabase read; the canonical Node verification example now has a real production row and exact displayed-code binding.
- Production Supabase migration is applied and remote migration history is aligned to the repository versions; no history repair was used.
- Supabase security advisor ERROR findings for public SECURITY DEFINER views were removed via SECURITY INVOKER public views backed by narrow helpers in a non-exposed private schema; anonymous RPC EXECUTE grants were removed.
- Supabase performance advisor FK-index, RLS init-plan, duplicate-index, and multiple-permissive-policy findings were remediated; remaining new-index notices are INFO-level unused-index observations.
- User-controlled profile website links are now restricted to absolute HTTP/HTTPS URLs on save, render, and profile normalization; script/data schemes are rejected.
- GitHub HTTPS/CLI write authentication is available; branches, PRs, merges and workflow changes can be pushed from the Oracle workspace.
- Real browser QA runs successfully in the official Playwright Chromium container; Snap Chromium cgroup limitations are no longer a blocker.
- Verified Knowledge schema, persistence services, revision model, community evidence, Knowledge Gaps, shelf state, freshness and author dashboard are implemented, PostgreSQL/RLS tested, and active in production.
- Raw confirmation identity/free text and raw revision snapshots are no longer public surfaces. Public failure/revision views are privacy-safe aggregates/history; author failure details use an owner/admin-only identity-free RPC.
- Authors cannot write `postify-verified` into database metadata. The badge is derived only from a successful deterministic release execution artifact.
- Pre-migration frontend/backend compatibility is explicit through `knowledge-backend-status.json`; the current production schema does not generate noisy missing-table requests or force public reading into fallback content.
- Main entry size was reduced from roughly 338.6 KB to ~294 KB minified; a 320 KB build budget and lazy-boundary preload checks now protect the gain.

## Hosting boundary — 2026-08-28
- GitHub Pages still returns an initial HTTP 404 for direct SPA deep links before the checked-in `404.html` fallback restores the client route. Production browser smoke classifies only that document-level behavior as expected; unexpected API/subresource errors still fail the release.

## 2026-10-18 — Still-open final design/QA evidence

- Native Chromium zoom was sampled automatically for nine routes at 100/200/400 (27/27 pass) using a new OS-level zoom harness. **Manual screen-reader testing, complete focus order, focus-not-obscured and all authenticated/editor/admin flows are NOT signed off**; do not claim full WCAG 2.2 AA conformance.
- Four empty/populated bookmark pixel snapshot mismatches predate the account migration (confirmed same dimensions at source commit `7743e51`). Keep the visual reference review gate open; no mass screenshot update.
- OAuth, authorization/RLS, profile/storage and CRUD using nonproduction Supabase accounts remain untested in this isolated QA phase. Mobile Lighthouse startup, field p75 Core Web Vitals and final visual review are still open; no push/deploy.

## 2026-10-18 — Admin snapshot drift and manual focus acceptance

- The 320px Admin sticky table column covered keyboard-focused controls at real 400% zoom; fixed locally with a ≤360px scoped responsive fallback and confirmed by two RED→GREEN Playwright regressions. The 390px/1440px Admin screenshot snapshots still differ from runtime in exactly the same way on the old `250b532` source (4/4 reference mismatches); these **pre-existing** visual baselines remain unapproved.
- The protected Editor/Knowledge/Admin focus tests are bounded **fake-service** samples: real RLS/permission checks and full authenticated screen reader/WCAG2.2 AA signoff remain open.

## 2026-10-18 — Unresolved mobile startup performance with interaction trade-off

- Safe-looking initial Sheet deferral saved ~13.5KB JS but increased throttled mobile first-menu latency from 423ms to 1382ms median and TBT from 594ms to 746ms despite some FCP/LCP improvements in three-pair Lighthouse. Experiment was fully reverted. React startup evaluation, style/layout and field CWV p75 remain open; do not claim Lighthouse performance acceptance based on one favorable run. See design/MOBILE-MENU-PERFORMANCE-AUDIT-20261018.md.

## 2026-10-18 — Mobile startup performance is still a release gate

- Reduced one synchronous initial zero-scroll home fallback anchor measurement; three paired lab Lighthouse runs show only small LCP improvements and mixed TBT. This does **not** resolve the significant React/vendor startup long task or establish better field p75 Core Web Vitals. Keep mobile performance acceptance open. Do not trade away first-menu responsiveness or back-navigation scroll accuracy.

## 2026-10-18 — Blocker: complete visual CI snapshot gate

- Required `.github/workflows/ci.yml` visual suite currently **81/115 screenshot failures**, with 49 geometry/dimension mismatches and 32 pixel mismatches. Only individual pre-migration Admin/Bookmark examples have been independently shown to be old baseline drift; do not presume all 81 harmless. Current full CI would not authorize main publication.
- Staging Supabase identity/RLS/CRUD with synthetic data, manual screen-reader/WCAG2.2AA, field mobile CWV/performance target and explicit publication/rollback approval remain pending. Public production capability artifact `ready:false` is stale or backend-not-ready until authenticated verification; read-only production source remains `cba2c86`.
