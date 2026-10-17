# Postify — Mobile performance investigations (2026-10-17)

Oracle run: run-96210d9920c1; isolated implementation branch: chatgpt/ws-276e5f67e3ed.

The existing mobile Lighthouse laboratory baseline remains approximately 59–60/100 performance, LCP around 4.7–4.8 seconds and total blocking time around 550–580 ms. Automated Lighthouse accessibility, SEO and best-practices were 100/100. Previous profiling identified roughly 1.4 seconds of style/layout work and a long React-vendor task near 869 ms in a mobile simulation. Do NOT claim these are field p75 results.

## Experiment A — Offline post-service request suppression (REVERTED)

When Supabase was not configured, the candidate prevented redundant list/detail queries while keeping local fallback posts. Four dedicated configured/unconfigured unit tests passed; full lint, unit, build, smoke, security and 58/58 Chromium E2E passed. Nevertheless, two alternating Lighthouse A/B passes were worse:

| Pass | Baseline perf | Candidate perf | Baseline FCP | Candidate FCP | Baseline TBT | Candidate TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 59 | 56 | 3939ms | 3484ms | 553ms | 820ms |
| 2 | 60 | 56 | 3834ms | 3486ms | 570ms | 842ms |

Candidate first paint was earlier, but counted blocking time increased enough to lower Lighthouse score. No proven overall improvement, so all experimental source and new test files were removed. Raw reports: /tmp/postify-offline-lh-baseline-{1,2}.json and /tmp/postify-offline-lh-candidate-{1,2}.json.

## Experiment B — Disable mobile sticky-header blur (REVERTED)

The candidate used opaque approved newsprint at <=960px and kept desktop translucency intact. Browser-computed CSS confirmed none at 390px and blur at 1440px. Full lint, 165/165 unit, production build, smoke, security and 58/58 E2E passed. Performance remained unchanged:

| Pass | Baseline perf | Candidate perf | Baseline LCP | Candidate LCP | Baseline TBT | Candidate TBT |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 59 | 59 | 4802ms | 4715ms | 571ms | 601ms |
| 2 | 60 | 60 | 4681ms | 4691ms | 571ms | 568ms |

Reports: /tmp/postify-header-lh-baseline-{1,2}.json and /tmp/postify-header-lh-candidate-{1,2}.json. The experiment was reverted rather than introducing a visible design change without performance evidence.

## Next actions and release gate

First capture a Chromium performance trace targeting React-vendor startup tasks, forced style/layout initiators and the eager Supabase/auth dependency graph. Avoid changing eager auth initialization/RLS until test fixtures cover signed-in sessions, OAuth callback, token restoration, route authorization, sign-out and error recovery without production accounts. Only then attempt architecture-level splitting and re-test.

Manual WCAG 2.2 AA (screen readers and real 200%/400% zoom), real authenticated editor/admin/knowledge operations, field p75 Core Web Vitals and final editorial visual acceptance remain open. GitHub push/deployment are NOT authorized. The experiments above were rejected and **no experimental app source changes remain**.

## 2026-10-17 — CDP 4x CPU startup trace and safe follow-up

Captured actual Chromium DevTools Protocol startup traces (390 CSS px and 4x CPU slowdown) from the last verified production build, saved in Oracle at:
- /home/ubuntu/.oracle-dev/visual/postify-startup-profile-20261017/startup-trace.json
- /home/ubuntu/.oracle-dev/visual/postify-startup-profile-20261017/startup-cpu-profile.json
- /home/ubuntu/.oracle-dev/visual/postify-startup-profile-20261017/startup-summary.json

Baseline: longest RunTask ~911ms and FunctionCall ~906ms; Layout total ~384ms and UpdateLayoutTree ~273ms. CPU sample attribution included ~409ms on the feed geometry read caller stack and ~91ms on a date-formatting caller stack. Minified frame labels are approximate; a stack name alone is NOT proof of a bottleneck.

A tested candidate skipped the feed anchor read when scrollY <= 1. Targeted Vitest and full Chromium E2E 58/58 passed, but the trace retained ~902ms longest task and ~382ms layout; Lighthouse A/B baseline 59/60 versus candidate 59/60. The candidate source and temporary test changes were REVERTED. Evidence: /tmp/postify-no-first-layout-lh-baseline-{1,2}.json and candidate-{1,2}.json, candidate CDP trace in the Oracle visual startup-profile candidate folder.

A smaller change to public article metadata WAS retained: getPostDateFormatter caches immutable Intl.DateTimeFormat instances per normalized language, instead of constructing one for every displayed date. A new test verifies identical Turkish and English output. Two paired Lighthouse mobile runs showed baseline 59/59 and candidate 60/60; candidate TBT 573/571ms versus baseline 580/581ms. The small difference is not sufficient to accept the mobile performance release gate. Reports: /tmp/postify-date-cache-lh-{baseline,candidate}-{1,2}.json.

## Additional genuine auth-state correctness defect

While preparing safe authentication test fixtures for potential future Supabase bundle splitting, a NEW failing unit test reproduced stale profile hydration restoring authenticated UI state AFTER SIGNED_OUT. This is a demonstrated state-race defect, not a hypothetical optimization concern.

The useAuth hook now uses an auth revision ref: each newer auth callback invalidates pending older hydration after awaits, a direct logout invalidates in-flight requests even if SIGNED_OUT arrives later, and an initial session lookup cannot override a newer auth event. New non-production mocked tests cover delayed profile after SIGNED_OUT, stale session lookup after SIGNED_OUT, and direct logout with late profile response. Existing login and profile-enrichment tests still pass. Live account, OAuth redirect, token refresh and real RLS tests are still NOT covered; no assertion of live production conformance.

Further optimization should be evidence-driven: isolate React render overhead and CSS layout via Chrome traces, and establish more complete session/OAuth fixtures before any risky Supabase lazy initialization. Mobile performance, field CWV p75, manual WCAG 2.2 AA at native zoom and assistive tech, authenticated admin/editor/knowledge operations, and final visual acceptance remain OPEN. GitHub push/deployment need separate user authorization.

## 2026-10-18 — Mobile dialog idle prewarm trial (REVERTED)

A tested alternative moved the eager `Sheet` import from module evaluation to a `requestIdleCallback` prewarm with immediate import when the menu was requested. The Radix dialog's two focused mobile Playwright tests remained green, including the existing 250 ms click-to-mount gate. Two production bundles were compared in separate localhost preview servers using cold Chromium contexts, 390 × 844 viewport, 4× CPU throttle, three passes each, without touching user services.

| Local CDP metric (3-run median) | Baseline c34ebd0 | Idle candidate |
| --- | ---: | ---: |
| FCP / observer LCP | 1288 / 1288 ms | 1268 / 1268 ms |
| Longest reported task | 873 ms | 919 ms |
| Post-FCP estimated blocking | 101 ms | 106 ms |
| JS resource transfer bytes | 227093 | 227165 |

The 20 ms FCP difference is too small/noisy and the candidate's blocking and longest task were worse. The import experiment was REVERTED, and its two private temporary preview servers stopped. These CDP browser laboratory figures are **not** Lighthouse scores or field Core Web Vitals; do not treat the LCP observer as real user p75. Mobile performance QA is still OPEN.

## 2026-10-18 — Experimental mobile feed containment (REVERTED)

Tested adding `content-visibility: auto; contain-intrinsic-size: auto 320px` to feed cards 3+ only below 960px. The candidate was produced as a separate production build and compared against unchanged local commit `c8861a8` on two isolated preview servers. Five independent 390px cold Chromium contexts per build, CPU 4x throttle, measured median:

| CDP metric | Baseline | Candidate |
| --- | ---: | ---: |
| First Contentful Paint | 1288ms | 1268ms |
| Longest long task | 875ms | 860ms |
| Estimated post-FCP blocking | 84ms | 74ms |
| Script transfer | 227119 bytes | 227129 bytes |

One candidate run was highly unstable: FCP 3512ms and longest task 2129ms. Five scoped Chromium checks passed (mobile 200% CSS text scaling, format navigation, discovery, card hierarchy). The small medians and the severe tail outlier do not establish a reproducible performance benefit; **all candidate CSS source was reverted**. These are local CDP lab metrics, not Lighthouse or field CWV; estimated blocking is not Lighthouse's TBT calculation.

The previous sampled V8 profile of an older build attributed many CPU samples to the feed absolute-position geometry reader (`readAbsoluteTop`/`getBoundingClientRect`) as a possible forced-layout contributor. But an earlier direct scroll-at-top bypass did not improve paired Lighthouse results; the captured attribution alone is not reliable causal evidence. Preserve scroll history and anchor behavior in future optimizations. A new mobile browser test checks that opening a feed card and navigating back restores the same card near its previous viewport position, with 10px tolerance. It passed in an isolated targeted Chromium run. Final mobile Lighthouse performance gate and field CWV p75 remain **OPEN**; no push/deploy.
