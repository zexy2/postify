# Postify mobile startup: CPU/style tracing and top-of-page anchor A/B — 19 October 2026 (TRT)

Oracle run `run-96210d9920c1`, source **`e66043bd1207063e4bc1c1595d79a4aa8eeee8e8`**, isolated `chatgpt/ws-276e5f67e3ed`. Local-only Chromium and localhost production preview; **no production credentials, database changes, app-code commit, push, merge, release or visual golden rewrite**. The temporary tracing scripts and rejected one-line candidate were removed after collecting evidence. Node 24.21.0, fresh exact-source Vite build (Oracle `job-ddc1b501a860`).

## Chrome DevTools Protocol CPU + layout traces (two independent page loads)

On a fresh browser context for each load, used **390×844 mobile viewport, 4× CPU, 150ms RTT, 190000 B/s download** and disabled service-worker caching. Started V8 sampling profiler and Chromium `devtools.timeline` trace **before navigation**, stopped after local page reached network idle. Tracing also incurs overhead; do not equate each recorded sampled millisecond with Lighthouse field time or claim an exact causative speedup. All runs produced eight visible feed cards, no page errors, JS transfer **228,101 bytes**. Reproducible evidence in `job-1d8f131f398b`, full raw `/tmp/postify-e66043b-profile-{1,2}.json`, summaries `/tmp/postify-e66043b-profile-{1,2}-summary.json`.

| Main renderer main-thread observation | Trace 1 | Trace 2 |
| --- | ---: | ---: |
| Longest single RunTask | **1,635ms** | **1,566ms** |
| UpdateLayoutTree inclusive event durations summed | **1,097ms (18)** | **1,067ms (18)** |
| Layout inclusive event durations summed | **747ms (10)** | **691ms (10)** |
| Long tasks at least 50ms | 13 | 11 |
| Largest single Layout event | 282ms | 244ms |
| Main-thread first-nav duration from Performance API | ~4,999ms | ~4,840ms |

The longest task encloses the production `react-vendor` function call as well as multiple `UpdateLayoutTree` and `Layout` events. Some events are nested: **do not add task duration to its children or infer additive wall-clock time**. The first large Layout processed **663 dirty/total layout objects** and rooted at the document. This identifies a synchronous render/DOM/style burst rather than proof that the Supabase package was the CPU bottleneck.

Built a second exact-source **source-map-enabled** local Vite artifact (`job-b7cd6be09021`), used `@jridgewell/trace-mapping` to map CDP V8 sample frames back to original application/third-party files. Sourcemap attribution summaries are `/tmp/postify-e66043b-profile-{1,2}-attributed.json`. Large source-attributed sample groups recurred for `react-dom-client.production.js`, `src/hooks/useScrollAnchorTransition.js` (~1,020/~980 sampled ms across separate traces), and `src/App.jsx` (~217/~203 sampled ms). The tracing also includes V8 native/idle/program frames. These values are sampling-based attribution, **not exclusive function execution time or independent causal proof**. In particular the hook has a `scrollY<=1` fast path: more profiling would be needed to determine whether its apparent samples represent synchronous DOM work, scheduler overhead or source-map/inlining attribution.

## Narrow hypothesis: skip feed-card geometry reads at scrollY=0 — REJECTED

A temporary three-line change to `src/App.jsx` guarded `readViewportScrollAnchor()` with `window.scrollY > 1` during its `savePosition` listener. This does not touch RLS/auth or page visual styling; normal scrolled readers still follow the existing anchor algorithm. Targeted scroll-restoration tests **7/7** passed under Node24 (`/tmp/postify-anchor-guard-unit.log`). Baseline and candidate had separate production builds. The 320px and 390px browser comparisons each confirmed baseline **8** initial feed-card `getBoundingClientRect()` calls vs candidate **0**. Page scrollHeight was unchanged, eight cards remained, and clicking the final article/back restored **0px drift** both in absolute scroll and card position with no page errors (`job-2060df250e35`).

However, six alternating mobile Lighthouse13.5 runs (control/candidate sequence A–B, B–A, A–B) showed **no robust performance gain** (`job-de3d2a8c8cfb`):

| Median lab metric | Baseline | Candidate |
| --- | ---: | ---: |
| Lighthouse performance | **59** | **59** |
| First contentful paint | 3,849ms | 3,858ms |
| Largest contentful paint | 4,711ms | 4,739ms |
| Total blocking time | 582ms | 594ms |
| Style/layout diagnostic | 1,453ms | 1,476ms |

Raw reports: `/tmp/postify-anchor-lh-{control,candidate}-{1,2,3}.json`. Headless first mobile menu click under 4× CPU and constrained network: control **387/379/392ms**, candidate **458/434/388ms** — all **3/3** under the existing 900ms gate; report `/tmp/postify-anchor-menu-{control,candidate}.json`. The candidate increased neither reliability nor Lighthouse performance enough to merit an application change. **Rejected and restored original `src/App.jsx`**. The temporary experiment and attribution scripts in `scripts/qa/.oracle-...` were also deleted; both Git worktrees verified clean before writing this report.

## Technical decision / next action

**Production NO-GO remains.** Main mobile bottleneck is still the initial React/DOM commit coupled to a large synchronous layout/styling burst, not simply JavaScript download size. Further work should focus on source-attributed render/commit call stacks and element-count-aware layout choices **only with reversible, controlled A/B tests** and with safeguards for exact scroll restoration, keyboard focus, mobile Sheet first click, route parity, locale, auth integrity and correct content. Avoid repeating naive `content-visibility:auto` reserves (184px layout shift), auth code splitting (TBT regression), manual chunk splitting (worse FCP) or scrollY top guard (no measurable gain).

Release gates still open: a **separate** staged Supabase instance and synthetic A/B/C identities to verify OAuth/refresh/CRUD/RLS, owner review of 81 historical visual goldens and About/Contact art direction, manual WCAG 2.2 AA screen reader + zoom, field mobile p75 CWV, exact code PR CI, and explicit production approval. Laboratory pass does not approve a release.
