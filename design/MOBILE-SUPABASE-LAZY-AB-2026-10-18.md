# Postify mobile SDK startup experiment — rejected A/B, 18 October 2026

Oracle run `run-96210d9920c1`; isolated worktree based on **40fa398**. Scope: no Supabase staging credentials, no live-authenticated actor, no production changes. All experimental source edits were **reverted**, including a temporary config-only module; no application-code commit was kept.

## Hypothesis and tested implementation

Lighthouse had flagged ~40KB unused Supabase SDK transfer on public first load. The candidate created a tiny side-effect-free Supabase config flag, loaded `authService` dynamically only when used (preserving the existing subscribe-before-getSession code order), and returned the same local fallback post catalog directly in `usePosts` when Supabase was unconfigured. The canonical provider client remained synchronous in `lib/supabase.js` for protected services. No real OAuth/session/RLS/CRUD evidence is claimed: staging access remains absent.

Existing mocked auth, post and auth-service tests passed **28/28** under Node24 (`/tmp/postify-supabase-lazy-targeted.log`). Both production-like bundles were built from identical Node24/Vite tooling: control from `git archive HEAD` in an independent `/tmp` snapshot with shared dependencies; candidate from the worktree. Both served on distinct localhost preview ports. Independent mobile Chromium sessions with `postify_language=tr` and `en` observed eight post cards, expected masthead labels, no page errors and exact restored article/card scroll positions in that bounded test. Client JavaScript transfer fell **228,101 → 223,284 bytes** (4,817 bytes), but the SDK remained a browser resource via an eagerly used shared module/chunk (initial dependencies include the prewarmed mobile sheet). Thus the hypothesized ~40KB SDK elimination **was not achieved**. Browser evidence: Oracle job `job-c7eae9e23f3d`.

## Lighthouse 13.5.0 mobile, three alternating pairs

Same headless Chromium, default simulated mobile slowdown, performance-only. Pairs ran A–B, B–A, A–B against separate fresh builds; localhost only, no real user sessions or field data. Raw reports: `/tmp/postify-lazy-{control,candidate}-{1,2,3}.json`. Oracle job `job-6da42cec46f8`, exit 0.

| Pair | Control score | Candidate score | Control FCP | Candidate FCP | Control LCP | Candidate LCP | Control TBT | Candidate TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 60 | 58 | 3,833ms | 3,410ms | 4,686ms | 4,532ms | 566ms | 764ms |
| 2 | 59 | 58 | 3,850ms | 3,435ms | 4,713ms | 4,502ms | 579ms | 781ms |
| 3 | 59 | 58 | 3,845ms | 3,412ms | 4,705ms | 4,546ms | 578ms | 774ms |
| **Median** | **59** | **58** | **3,845ms** | **3,412ms** | **4,705ms** | **4,532ms** | **578ms** | **774ms** |

The candidate improved first paint (FCP ~433ms) and LCP (~173ms), but **TBT worsened by ~196ms** and the final Lighthouse score was lower by one point. A timing shift or separate code path could be involved, but the experiment **does not establish a definitive CPU root cause**. Mobile menu first-click latency, signed-in real OAuth/RLS and field p75 CWV were not measured for the candidate; mocked auth tests cannot stand in for those release gates. Do not trade observable responsiveness for an unconfirmed startup gain.

## Decision and next steps

**REJECTED**. Restored original `src/hooks/useAuth.js`, `src/hooks/usePosts.js`, `src/hooks/useAuth.test.jsx`, `src/lib/supabase.js` and deleted the experimental `src/lib/supabaseConfig.js`. Immediately verified clean isolated Git HEAD `40fa398`, original main `cba2c86` clean. No golden updates, app-code commit, push, merge, deployment or provider writes.

Potential safe follow-up: analyze which shared module makes the Supabase vendor chunk eager without sacrificing the proven mobile sheet prewarm (previously deferring the sheet caused ~1s worse first-click). Future changes require *paired* Lighthouse, a configured synthetic OAuth/session/RLS test when safe staging credentials exist, baseline-equivalent signed-out UI, scroll/history/keyboard focus and menu interaction checks. Current release is **NO-GO** due to missing staging, 81 unapproved historical visual snapshots, About/Contact design decision, manual WCAG 2.2 AA, mobile performance acceptance and exact PR CI/production approval.
