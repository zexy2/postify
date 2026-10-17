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
