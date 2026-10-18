# Mobile initial-load versus first-menu responsiveness — 18 October 2026

## Decision: retain eager-but-split Sheet preload

The public Header currently starts the `../ui/sheet` dynamic chunk at module evaluation, before the mobile hamburger is clicked. A proposed local-only experiment deferred loading that chunk until the hamburger opened and cached the pending import. The candidate was **fully reverted** after controlled A/B testing: it lowered initial JavaScript bytes but made the mobile navigation affordance substantially slower under constrained network/CPU. The on-demand candidate code is **not** part of an accepted commit, and the prior menu-prewarm functional E2E contract remains unchanged.

## Controlled protocol

1. Extract clean baseline Git `5ae3813` using `git archive` to a separate `/tmp` directory, symlink installed `node_modules`, run a fresh full Vite PWA build and `smoke:build` (both passed; main entry **314,022** bytes). Separately build the experimental worktree (main entry **314,107** bytes), with no production/deployment write.
2. Serve each immutable production build independently via localhost Vite preview. Run **Lighthouse 13.5.0, mobile performance-only, default simulated 4× CPU/150 ms RTT throttling**, three *alternating* baseline/candidate pairs in a single series. Same machine, browser flags and Lighthouse version. Results below are lab estimates, not field Core Web Vitals; there were only three pairs.
3. Separately use headless Chromium with actual DevTools Protocol network emulation (150 ms RTT / 190 KB/s down) and 4× CPU throttling, fresh isolated context per run, service workers disabled. Wait for the initial page network to become idle, press hamburger, measure time until the visible close-menu control appears. Three samples each. All scripted interactions use only local preview servers and no credentials.

| Pair | Baseline score | Experiment score | Baseline FCP (ms) | Experiment FCP (ms) | Baseline LCP (ms) | Experiment LCP (ms) | Baseline TBT (ms) | Experiment TBT (ms) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 59 | 59 | 3861 | 3341 | 4724 | 4424 | 583 | 796 |
| 2 | 59 | 62 | 3860 | 3386 | 4736 | 4278 | 598 | 656 |
| 3 | 59 | 60 | 3858 | 3301 | 4727 | 4343 | 594 | 746 |
| **Median** | **59** | **60** | **3860** | **3341** | **4727** | **4343** | **594** | **746** |

The experiment reduced the initial count of JavaScript network resources **8 → 6** and JavaScript transfer **228,083 → 214,539 bytes** (saves **13,544 bytes** in this locally built bundle). The Sheet chunk was absent until the first click, but the menu became slower:

| Cold 4× CPU / constrained-network sample | Existing prewarm (ms) | On-demand experiment (ms) |
| --- | ---: | ---: |
| 1 | 660 | 1382 |
| 2 | 423 | 1337 |
| 3 | 392 | 1478 |
| **Median** | **423** | **1382** |

The median FCP/LCP improved under Lighthouse simulation, but median TBT regressed ~152 ms and total Lighthouse score improved only one point. A nearly **one-second worse first mobile navigation interaction** is not acceptable for a task-first editorial UI. All app/source code modifications to Header and the prewarm E2E test were reverted before acceptance. No misleading Lighthouse pass or false production field CWV claims.

*Validity note:* An initial nonalternating exploratory set reported Lighthouse 84/77/87 for a previously generated asset snapshot and 62/63/64 for a fresh candidate. These were **not equivalent source builds** and are explicitly excluded from the final A/B decision. Only the six alternating, freshly built runs above constitute the comparative experiment.

## Repeatable quality guard

`MOBILE_MENU_PERF_URL=http://127.0.0.1:4445/ node scripts/qa/mobile-menu-startup.mjs`

Run only against a **local rebuilt production preview**, not a real site. The script simulates the constrained network + 4× CPU and repeats three cold-context trials. It checks that the Sheet chunk preloads before interaction and that the visible menu appears within a conservative **900ms** per run, then emits a JSON report under `/tmp`. It passed **3/3** for the original prewarmed bundle; against the rejected experiment it failed **3/3**, correctly detecting the regression. Lab thresholds are advisory and may require repeat runs under differing host load; this is not a user-device or p75 performance guarantee. The permanent E2E test continues to verify the prewarmed mobile menu with a faster first-click budget on the local reference environment.

## Remaining performance QA

Mobile startup still spends substantial time in React/vendor evaluation and style/layout. Stable Lighthouse improvements require larger paired samples and repeatable profiling of main-thread tasks, without breaking auth, accessibility, image LCP discovery, scrolling or responsive layouts. Production CrUX/field p75 **LCP, INP and CLS have not been collected**. The final performance release gate stays **OPEN**; no external push/deployment was performed.
