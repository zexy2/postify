# Postify — second public slice: Home editorial cover

Status: local isolated candidate, NOT deployed and NOT yet accepted pixel-for-pixel. The owner asked why previously designed Home wasn't in PR #101. First About/Contact public slice intentionally excluded 85 unrelated broader development commits. CD-012 approved the Home art direction, not every mobile snapshot or the sitewide CSS migration. Prior mobile performance lab ~59/100 with LCP ~4.79 seconds remains a warning.

## Scope

- Start from live main 71a1343 in independent Home rollout worktree and preserve all existing production and development branches.
- Copy only HomePage JSX/CSS, Hero JSX/CSS and the missing responsive cover source helper/tests. No global index.css changes, no sitewide Header/Footer or auth/admin/editor/Knowledge updates.
- Scope existing approved PL-01 palette and OFL Fraunces font within Home. Existing font assets came with About/Contact PR #101.
- Check featured/feed ranking parity, filters, search, empty states, anchor restore, card links and viewport 320/390/768/1440, TR/EN light/dark. Run exact build, unit/lint/security, product Chromium, fixed-image visual suite and new screenshots. Compare performance with ~59 mobile baseline.
- User approves actual current coded Home screenshots before renewing its four goldens. Next Home release gets independent exact CI-green PR and only then a controlled production merge. Hosted Supabase actor tests, native AT WCAG and field p75 CWV remain separate release gates for other features.

## First scoped candidate proof (not release signoff)

- Independent Home rollout branch created from exact deployed main 71a1343 and original 85-commit redesign left intact.
- Initial Node24 Vite build, 163/163 Vitest and ESLint passed. First browser captured the expected dark editorial Home heading on 320/390/1440 with zero page JS errors and overflow, but discovered a **real missing image asset dependency**: new Hero responsive srcSet helper referenced 480/800 image copies that were absent from live main. They were NOT loaded by the initial candidate. Resolved by adding the 16 original tracked optimized images from approved design worktree alongside the helper. Rebuilt exact candidate and verified featured image loaded (naturalWidth>0), PL-01 dark Hero rgb(31,36,32), zero overflow/page errors at 320/390/1440, 3/3 viewport samples PASS.
- Existing main Header and other global screens are intentionally unchanged; sitewide redesign was not implicitly approved. Home reflow is intentionally isolated to the route; final screenshot approval and full CI, performance comparison to ~59 baseline, empty/filter state and all 4 Home image goldens remain prerequisites to deployment.

## Current release gate — RED, not deployable (2026-10-19)

- Fresh source build succeeds with added 16 responsive cover files. Tested actual Chromium Home at light theme 320, 390, and 1440 pixels: featured responsive image naturalWidth > 0, dark Hero background `rgb(31,36,32)`, no horizontal overflow or JS errors, 3/3. The first browser probe's `heroBg:null` was a *faulty inspector selector*, not the app; the first captured browser image nevertheless revealed legitimately missing responsive assets. Resolved by adding 16 original project images and rerunning 3/3.
- Source Vitest **163/163 PASS** (43 files), ESLint **PASS** (Oracle job job-cb722e71ad8a). Later full `npm run verify` via job job-75e0195dda96 **FAILED at production smoke budget**: built entry JS **320361 bytes** vs required **320000 bytes** (over by **361 bytes**). Do not silently raise the threshold, call this release-ready or push/merge/deploy. Build and local tests preceding smoke passed; full visual screenshot/CI and performance tests **not yet run**.
- Next action: reduce initial JS bundle safely without removing responsive cover behavior or changing auth, rerun full Node24 verify, exact compiled app product Chromium tests, fixed-image Home/discovery snapshots and Lighthouse mobile. Show actual candidate Home desktop/mobile TR/EN light/dark for owner pixel acceptance before updating Home goldens. Only then open reviewable Home PR. Preserve existing live About/Contact first slice SHA 71a1343 and PL-01 tokens.
