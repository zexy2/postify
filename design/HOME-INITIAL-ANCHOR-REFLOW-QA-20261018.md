# Home initial viewport anchor — small render/layout QA (18 Oct 2026)

## Scope and reason

Lighthouse lab traces for the existing mobile home bundle include ~1500–1850ms style/layout work and a forced-reflow hotspot. The home fallback-to-live position-preserving hook `useScrollAnchorTransition` synchronously called `getBoundingClientRect()` in a React `useLayoutEffect` even when `scrollY` was zero. Before the user scrolls there is no position to preserve, so an immediate measurement is unnecessary. It can force a layout while the first React commit is settling.

The proposed small, reversible change in `src/hooks/useScrollAnchorTransition.js` skips this **initial** geometry read at `scrollY <= 1` and records `{ active, absoluteTop: null }`. After the reader scrolls, the existing scroll/ResizeObserver sampling path captures the anchor as before. When a scrolled reader transitions from fallback to a live result, the established delta-compensation path remains unchanged.

A new focused regression was added to `src/hooks/useScrollAnchorTransition.test.jsx`: it **failed before** the code change because an initial top-of-page render read the anchor geometry, then **passed after** the guard and verified geometry is still captured after scrolling. All existing live/fallback delta compensation tests passed as part of this focused suite.

## Controlled mobile lab A/B

Both compared pages used immutable local production builds on one Oracle VM, separate local ports, Lighthouse **13.5.0** mobile performance only with its default simulated 4× CPU / 150ms RTT profile. The baseline asset bundle came from the independently rebuilt clean `5ae3813` (application code identical for this path to the `688bb69` before change; intermediate commits affected only admin focus CSS and QA/documentation). The candidate bundle came from the isolated working tree containing only the hook change and the regression test. Three **alternating** pairs were run in a single job, not six cherry-picked independent samples. These are lab samples, not field p75 data.

| Pair | Baseline score | Candidate score | Baseline FCP | Candidate FCP | Baseline LCP | Candidate LCP | Baseline TBT | Candidate TBT | Baseline style/layout | Candidate style/layout |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 57 | 59 | 3984ms | 3855ms | 4868ms | 4728ms | 602ms | 607ms | 1568ms | 1510ms |
| 2 | 53 | 55 | 4082ms | 4012ms | 5065ms | 5002ms | 758ms | 710ms | 1850ms | 1717ms |
| 3 | 59 | 59 | 3863ms | 3848ms | 4743ms | 4711ms | 591ms | 583ms | 1521ms | 1482ms |
| **Median** | **57** | **59** | **3984ms** | **3855ms** | **4868ms** | **4728ms** | **602ms** | **607ms** | **1568ms** | **1510ms** |

All three candidate runs showed *small* FCP/LCP and style/layout reductions. Median per-pair LCP difference was ~63ms (individual improvements 140, 63, 32ms). TBT did **not** consistently improve: first candidate run regressed by about 5ms; median TBT rose 5ms. Score increased two points median, but three samples are too few to infer stable production gains. Do not claim a significant mobile performance breakthrough or a resolved Lighthouse release gate.

## UX regressions to protect

Before running the entire suite, a controlled cold-context Chrome CDP 4× CPU + 150ms RTT / 190KBps down local-production first-mobile-menu test passed **3/3**: 416/587/670ms, all with sheet module preloaded, under its 900ms advisory lab budget. The previous experiment deferring the mobile sheet until click was rejected and remains reverted. The project E2E scroll-history test must continue to restore the original mobile feed card position within 10px after opening an article and going back; the fallback-to-live delta tests must remain green. These tests preserve practical UX while reducing a startup read.

## Release gates left open

A quick read reduction does not establish Chrome forced reflow root cause by itself. Real production Android/iOS, Web Vitals field p75 LCP/INP/CLS, consistent Lighthouse gains, browser/assistive tech acceptance, pre-existing screenshot baseline drift and staging Supabase authorization all remain open. No production DB/user data, screenshot baselines, push or deployment is touched by this local change.

## Final source QA results (local, no deployment)

- Node24 final QA job `job-058e16d07686` completed **exit 0**. Knowledge verification and Vite PWA production build passed, ESLint clean, smoke verifier accepted 11 critical artifacts and main JS entry **314,094 / 320,000 bytes**; npm release security check reported **0 known vulnerabilities**.
- **205/205 Vitest tests** passed (includes newly added RED→GREEN no-scroll layout read and existing fallback compensation checks). All **60/60 Chromium UI Playwright E2E** passed (zero skipped/flaky), including mobile feed-card back-navigation restoration tolerance under 10px.
- Constrained network/CPU first-menu smoke against the same candidate production preview passed **3/3** (416/587/670ms under 900ms). No mobile navigation module deferral applied.
- These checks justify retaining a **small** defensive startup improvement, not signing off the overall mobile Lighthouse / field CWV release gate. Reports were imported to Oracle QA phase4, measured Lighthouse JSON and native menu JSON preserved in `/tmp` for local forensic comparison.
