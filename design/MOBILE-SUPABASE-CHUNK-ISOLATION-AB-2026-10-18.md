# Postify: mobile Supabase / Radix chunk isolation and first-load QA (18 October 2026)

Oracle run: `run-96210d9920c1`. Baseline branch `chatgpt/ws-276e5f67e3ed`, Git HEAD **`699f6dbb33fa1382300093e1783dd92dd407fe58`**. Local-only Node 24.21.0 / Vite / Rollup 4.63.1 / Lighthouse 13.5.0 / headless Chromium. No production browser, real user identity, remote Supabase mutation, golden rewrite, push, merge or deployment. **Both candidates were reverted; release is NO-GO.**

## Dependency attribution

- Current `vite.config.js` forces `@supabase` modules into a named vendor chunk via the `manualChunks` callback. The default transitive grouping also places helpers used by the prewarmed Radix mobile sheet on a path to this chunk. The initial public app additionally eagerly imports `authService` through `useAuth` and dynamically fetches `postService` through `usePosts` even when Supabase config is missing.
- Rollup supports `output.onlyExplicitManualChunks: true`, confirmed in local Rollup 4.63.1 types/runtime. A temporary build with `--sourcemap` (`job-a9da5feac291`) showed `sheet-*.js` depends on a Radix `index-*.js` whose helper module also serves `@supabase`, but placing shared helpers outside the SDK alone **does not stop the app's auth/post-service dependencies from importing the SDK**. This confirms a dependency-graph contribution, not a proven CPU bottleneck.
- **Candidate A: bundler-only:** add `onlyExplicitManualChunks: true` with no app-service edits. SDK still loaded on first paint; initial browser JavaScript transfer **228,101 → 229,339 bytes**, an increase of 1,238 bytes. Chromium 390px home UI contained 8 cards without page errors; card history restored to exact scroll position. Source builds and browser QA in `job-7042bcf4e37f`, `job-7b15281501e2`.
- **Candidate B: combined:** retain Candidate A and split a tiny no-SDK `supabaseConfig` flag, dynamically import auth service at use sites, and skip fetching post service when public read has no Supabase configuration (same device-local fallback data). Mocked auth/post service targeted tests **28/28** passed (`/tmp/postify-combined-lazy-targeted.log`); local mobile browser loaded 8 correct cards in English and Turkish, no page errors, **and no Supabase vendor JS resource**. Initial JavaScript transfer **228,101 → 182,170 bytes**, saving **45,931 bytes (~20%)**. Source build + browser results `job-f90361265d5a`. No hosted auth, real OAuth or RLS was tested for the candidate.

## Alternating Lighthouse mobile A/B evidence

Three pairs each, control/candidate sequence A–B, B–A, A–B, local independent production builds with consistent simulated mobile throttling. Medians; absolute lab numbers vary across runs. `score` is Lighthouse performance, `FCP`, `LCP` and `TBT` are simulated, **not field p75 CWV**.

| Run / candidate | Score | FCP | LCP | TBT | First-load JS |
| --- | ---: | ---: | ---: | ---: | ---: |
| A control | 59 | 3,854ms | 4,719ms | 580ms | 228,101 B |
| A bundler-only | 60 | 4,059ms | 4,744ms | 522ms | 229,339 B |
| B control | 59 | 3,885ms | 4,780ms | 567ms | 228,101 B |
| B combined | 55 | 3,294ms | 4,696ms | **975ms** | **182,170 B** |

- Candidate A's one-point score and 58ms TBT gain required accepting an approximately **205ms slower first paint** and a slightly worse LCP, without the intended SDK-elision benefit. Insufficient improvement to accept as a release optimization; not retained. Raw runs `/tmp/postify-explicit-lh-{control,candidate}-{1,2,3}.json` (Oracle `job-7b15281501e2`).
- Candidate B's 591ms faster FCP and 84ms faster LCP were offset by a measured **408ms worsening of TBT** and a 4-point lower score. Reject despite 20% less initial JS. No definitive root cause of the CPU scheduling shift has been established; do **not** describe module deferral itself as a conclusively proven cause. Raw runs `/tmp/postify-combined-lh-{control,candidate}-{1,2,3}.json` (Oracle `job-89ff79b176bd`).

## Mobile first-click interaction guard

Three cold headless 390px trials per variant under **4× CPU + 150ms RTT / 190KB/s** throttling, script `scripts/qa/mobile-menu-startup.mjs`. The Radix sheet **was preloaded in all variants** and all runs passed the existing **900ms** threshold.

| Experiment | Control three clicks | Candidate three clicks |
| --- | --- | --- |
| A | 415 / 417 / 411ms | 405 / 426 / 432ms |
| B | 421 / 405 / 403ms | 425 / 408 / 411ms |

All successful; these results do not compensate for Candidate B's poor whole-page TBT. Raw JSON `/tmp/postify-explicit-menu-{control,candidate}.json` and `/tmp/postify-combined-menu-{control,candidate}.json`.

## Decision and next action

**REJECT both candidates and preserve the prior app implementation.** Restored `vite.config.js`, `src/lib/supabase.js`, `src/hooks/useAuth.js`, `src/hooks/usePosts.js`, `src/hooks/useAuth.test.jsx`; removed test-only `src/lib/supabaseConfig.js`. Verified isolated `699f6db` and original main `cba2c86` worktrees both clean before writing these QA-only notes. No accepted frontend performance gain or full WCAG/field CWV clearance is claimed.

For the next optimization, prioritize a per-frame Chromium Performance trace to attribute JavaScript evaluation and Style/Layout cost to concrete call stacks before editing more dependencies, then repeat paired performance tests including FCP/LCP/TBT, first mobile click, native keyboard/scroll restoration and protected auth behavior. Real Supabase staging users A/B/C and OAuth/session/RLS/CRUD tests, visual owner acceptance (81 historical snapshots, unapproved About/Contact), manual WCAG 2.2 AA, production CI and explicit release signoff remain open. Production stays **NO-GO**.
