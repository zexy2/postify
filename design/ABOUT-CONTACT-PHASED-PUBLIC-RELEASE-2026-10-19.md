# Postify — staged public release, About + Contact only (2026-10-19)

## Owner permission and scope

Owner approved the actual PL-01 About and Contact v3 screens and requested a gradual production launch on 2026-10-19. This owner approval supersedes the earlier prohibition on preparing a deployment **for these two public read-only pages only**. It is not permission to silently change the rest of the 85-commit redesign worktree, apply production database migrations, enable unreleased authenticated Knowledge write flows, or publish an unverified branch.

Main production source at kickoff: `cba2c8652ca61d1dc559368e17a506061e0d4e95`; the user's original UI development branch latest approved `0a36a5e` contains 85 unmerged commits, and **must not be merged directly**. This package uses independent worktree `postify-rollout-pl01-20261019` with branch `rollout/about-contact-pl01-20261019` created from unchanged main. Published live `release.json` initially matched `cba2c86`. No public deploy is implied by a local test, branch push or PR.

## Slice design isolation

- Only `src/pages/AboutPage.{jsx,module.css}` and `src/pages/ContactPage.{jsx,module.css}` are transplanted from actual approved `0a36a5e`, plus their scoped Playwright UI contract and local Fraunces route-use font files with redistributable OFL notice. Current global `src/index.css` remains unchanged; page-root scoped PL-01 variables preserve approved `#F4EFE6` paper, `#151B19` dark, `#A13826` oxide and `#F2AC91` coral without recoloring other product routes.
- Source is real bilingual React with genuine direct `mailto:` and GitHub links. No fake form, made-up submission, auth bypass, added user tracking or database writes.
- Security prerequisite on current main npm lock discovered **eight high-severity vulnerabilities**: brace-expansion, fast-uri, source-map-js and transitive `gh-pages/globby/fast-glob/micromatch/braces`. Pin CLI-only `gh-pages` dev dependency to available safe `6.1.1` and apply compatible transitive lock updates. Exact rebuilt `npm run verify:security` must report zero. CI website deployment uses `peaceiris/actions-gh-pages`, not this CLI; no behavior change to deployed runtime intended. Both package.json and lock file are part of this scoped release security adjustment.

## Required real checks before main publication

- Full Node24 verify (knowledge, real current-main Vitest, ESLint, build, 11-artifact smoke), security npm audit; real Chromium product test on exact built source; About/Contact light/dark 320,390,768,1440 viewport semantics; keyboard focus/anchors, contact link 44px and localized Turkish; no horizontal overflow/console errors.
- Full visual snapshot suite **must pass** without unrelated drift; only update individual About/Contact light/dark 390/1440 baseline shots following explicit design approval and inspection. Do NOT automatically accept unrelated screenshot changes, even if baseline snapshots are old.
- Check exact SHA branch CI via GitHub PR, including required Test/Lint/Smoke, Chromium, schema/PostgreSQL RLS, CodeQL, Dependency Review and Docker. A PR push is not a production deployment. Do not manually run `npm run deploy`, migration workflow or GH Pages deploy action.
- Keep `knowledge-backend-status.json` `ready:false` with `supabase-schema-pending` unless real *separate* staging credentials and authenticated users prove actual backend readiness. **No database schema application or staging OAuth/RLS certification** from a local PostgreSQL test.
- Public production first slice must not claim full-site WCAG2.2 AA manual native AT or mobile field CWV green: both remain release program open items. If these gates block main cutover, stop after CI PR until evidence gathered or new explicit scoped risk decision, not override with a fake green.

## Deploy and rollback boundaries

- GitHub `main` is protected; branch squash merge after required checks triggers GitHub Pages deploy automatically. Verify `release.json` reflects the merged SHA; production Chromium CI probes exact deployed SHA and machine-readable articles. Read-only smoke `/`, `/about`, `/contact`, static assets, theme, mailto/GitHub and capability JSON; never test protected writes on production.
- On new regression, halt merge if not yet merged; after a verified deployment, revert the **one scoped release commit** in a new reviewable PR and let same protected CI/Pages pipeline republish, then compare `release.json` to reverted SHA. This is a **frontend-only rollback**, not database rollback. No force-push or direct write to protected main.

## Verified isolated release evidence, 2026-10-19

- Main-based scoped branch first source commit c944897, no changes to unrelated 85-commit redesign branch. Node24 exact-source npm ci, npm run verify (161/161 Vitest, lint, build, 11-artifact smoke), npm run verify:security (0 vulnerabilities), PL-01 modern route browser contracts 18/18 and compiled-app Chromium 52/52 passed. Evidence job job-fc449802618c exit 0.
- Full deterministic screenshot run showed **47/128 pass, 81/128 fail**. Exactly 8 are About/Contact owner-approved v3 layout differences; **73 are other page snapshots** not directly changed in this narrow patch. Underlying Playwright report /tmp/postify-slice-fullvisual-before.json is RED, irrespective of diagnostic wrapper exit 0 (job job-42c8d2159d72). No root cause assumption and no unrelated golden refresh permitted.
- Visual comparison of real About/Contact desktop/mobile output confirmed the scoped approved design is recognizable, with different global navbar/footer remaining on old main design. Exactly eight scoped About/Contact snapshots were refreshed from actual Chromium screenshots. Targeted browser rerun **8/8 PASS**, no skipped or flaky (job job-1d2829e56926 exit 0). All 73 unrelated full-suite issues remain pending, not waived.
- GitHub Draft PR #101: https://github.com/zexy2/postify/pull/101. Required CI and visual investigation still underway. This is not a production publication; protected main and live site unchanged. Do not merge or deploy while visual suite or other release gates remain red.

## CI-pinned visual reconciliation (critical later evidence)

- Investigated earlier local-host visual suite which failed 81/128 with 73 unrelated baseline mismatches; on **unmodified main** five comparable samples also failed (file /tmp/postify-main-control-three.json: expected0, unexpected5), proving at least those five were independent of the new pages. Neither host run is valid proof that full official CI must fail.
- Exact GitHub Actions PR #101 run on initial b45d16b ran inside pinned image mcr.microsoft.com/playwright:v1.57.0-noble@sha256:3bed4b1a12f2338642f3d8cba28e291deef3c66bd4a964bbeb3e57bbff511dbd and reported **120/128 passed; exactly 8 About/Contact snapshots failed**. See Actions run 39241616097, Chromium job 118023534650. All 73 unrelated host mismatches **did not reproduce** in official CI.
- Pulled and verified exact immutable Playwright CI Docker image digest locally (901MB), ran eight About/Contact screenshot tests with --update-snapshots inside that same isolated pinned image using no network access: **8/8 PASS** job job-575552b2a5dd, report /tmp/postify-pl01-ci-pinned-evidence/eight-pinned-update.json. Only eight design-approved About/Contact light/dark desktop/mobile screenshot golden assets modified.
- Re-ran the COMPLETE 128 visual tests in the exact pinned Docker image with network isolation and *without updating snapshots*: **128/128 PASS**, zero unexpected/skipped/flaky. Oracle job job-f6e8b2f98e06 exit0, report /tmp/postify-pl01-ci-pinned-evidence/full-pinned-128.json. This is a credible **local CI-parity visual gate**, but the remote GitHub latest-commit run is still authoritative and not yet green until rerun. No other screenshot references updated.
- PR #101 remains DRAFT until its latest remote checks pass and public-slice accessibility/staging and owner release requirements are explicitly evaluated. No production publication yet.
