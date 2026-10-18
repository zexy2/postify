# Postify mobile performance experiment and footer reflow regression — 18 October 2026

Oracle task `run-96210d9920c1`; base source `a7fddc5`. All work occurred in isolated Postify worktree `chatgpt/ws-276e5f67e3ed`. No push, production deploy, remote DB operation or golden snapshot update.

## Experiment: content-visibility for offscreen compact feed rows — REJECTED AND REVERTED

Hypothesis: skipping layout of compact mobile feed cards after the initial four might reduce Lighthouse's ~1.5 seconds of initial style/layout work. Only the mobile feed was altered, using `content-visibility: auto; contain-intrinsic-size: auto 220px` for `.feedContainer > :nth-child(n + 5)` below 620px. Control and candidate were built separately from local source with Node24/Vite to independent `/tmp` production builds, previewed on different localhost ports. **The candidate source edit was restored afterward**; this is not a production change.

Six mobile performance-only Lighthouse 13.5.0 runs used the same simulated mobile throttling and Chrome version, alternating control/candidate by pair (`A-B`, `B-A`, `A-B`). All runs were local with no external authenticated provider. Artifacts are `/tmp/postify-perf-a7fddc5-{control,candidate}-{1,2,3}.json`; Oracle job `job-d260180207b8` exited 0.

| Pair | Control score / LCP / TBT | Candidate score / LCP / TBT | Result |
| --- | --- | --- | --- |
| 1 | 59 / 4,793ms / 563ms | 60 / 4,744ms / 574ms | LCP better, TBT worse |
| 2 | 58 / 4,848ms / 590ms | 60 / 4,745ms / 574ms | candidate slightly better |
| 3 | 56 / 4,879ms / 668ms | 54 / 5,008ms / 724ms | candidate worse |
| **Median** | **58 / 4,848ms / 590ms** | **60 / 4,745ms / 574ms** | small, variable benefit only |

Layout safety check with two independent Chromium contexts, 390×844, reduced motion, full feed loaded, source job `job-212d87011803`:

- Control: 8 feed cards; initial `documentElement.scrollHeight` **4,925px**, still **4,925px** after scrolling to last card. Its last four compact cards each measured ~206–207px.
- Candidate: initial page `scrollHeight` **5,109px**, shrank to **4,925px** after scrolling to last card because four skipped compact cards were each reserved ~253px before rendering. This **184px layout jump** outweighs the inconsistent ~2-point median Lighthouse improvement.
- Both variants restored the last card's top position and scrollY after a page navigation under this single browser scenario. That does not erase the initial intrinsic-size mismatch or prove general focus/anchor stability. No new CSS optimization accepted.

## Proven mobile footer clipping — FIXED

Follow-up DOM audit showed `documentElement.scrollWidth` matched viewport but `body.scrollWidth` exceeded it from offscreen horizontally scrolling navigation and the footer trust-label. The category buttons intentionally overflow within their own horizontal scroller; the trust label did **not**.

The third trust-model label did not fit its 3-column mobile footer cell. Measured **before fix** with clean baseline Node24 local preview, `postify_language` forced per test:

| Locale | 320px viewport label right edge | 390px viewport label right edge |
| --- | ---: | ---: |
| English `Reproducibility` | 353.5px | 398.6px |
| Turkish `Tekrarlanabilirlik` | 372.9px | 418.0px |

Consequently the Turkish label extended about **53px** beyond the 320px viewport and about **28px** beyond the 390px viewport; root horizontal overflow was hidden, silently clipping the text. The fix adds **only `overflow-wrap: anywhere`** to mobile `.systemLine strong`, without changing desktop design structure, labels or responsive column count.

Four permanent E2E tests were added for 320/390px in both locales. They check the complete label text and compare geometry with **the containing footer cell and viewport**, rather than relying on `documentElement.scrollWidth` (which failed to expose the clipping). Oracle `job-99732f9ebf5e` contains the pre-fix DOM measurements; `job-490b64370c70` showed **4/4 targeted PASS and 68/68 full Chromium product suite PASS**, 0 flaky/skipped. The suite had 64 scenarios before these four additions. No visuals were automatically rebaselined.

## Release restrictions

The footer clipping is a verified responsive accessibility defect, not evidence that the whole site meets WCAG 2.2 AA. Performance remains **NO-GO**: mobile Lighthouse median around 59, no accepted LCP/TBT gain, production field p75 unavailable. Real Supabase staging OAuth/RLS/CRUD, outstanding 81 visual golden mismatches and owner About/Contact acceptance, native screen-reader/manual accessibility, actual exact-source PR CI and explicit production release authorization are still required.
