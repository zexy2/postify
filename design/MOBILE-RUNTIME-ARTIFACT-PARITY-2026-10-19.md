# Postify mobile A/B runtime artifact parity — 19 October 2026

Oracle run `run-96210d9920c1`, source `a59e1f0`. This finding **corrects the interpretation of previous local A/B performance experiments**; it is not a production performance release. All work is in isolated worktree `chatgpt/ws-276e5f67e3ed`; no push, main merge, golden update, real provider writes or deployment.

## Reproduced uncontrolled variable

The prior test setup built the **control** from `git archive HEAD` in a clean `/tmp` source, but the candidate from the live isolated worktree. The project ignores locally generated release evidence and knowledge artifacts. Consequently the control's built `public/` content omitted **18 `knowledge/*.json` files**, `verification/node-json-parse-v1.mjs`, `verification-runs.json`, and `runtime-release-status.json`. The worktree candidate included them. Generated `index.html` and `sw.js` also naturally differed between bundles. In all, 23 non-`assets` file paths were originally absent or different: 21 missing knowledge/verification files, plus two expected generated entrypoints.

The actual content discrepancy mattered: on the home featured knowledge card the control rendered **"Author tested · Current"**, while the candidate rendered **"Postify re-check required · node v24.21.0"**. The longer badge increased its height and made the card/page **16–17px taller** on 320px/390px phones. These text and geometry differences occurred **despite identical CSS assets**. Font loading alone did not explain them.

**Conclusion:** earlier A/B deltas based on `git archive` control versus local worktree candidate were *confounded by generated public data*. They remain honest measurements of those particular builds but **cannot be attributed solely to the code optimizations**. Prior conservative decisions not to ship experimental optimizations remain valid; their claimed causal speed regressions/improvements are not proven. Do not use old A/B medians as strict code-only baselines.

## Corrected experiment method

In *temporary preview output only*, copied the candidate's generated `knowledge/`, `verification/`, `verification-runs.json`, and `runtime-release-status.json` into the control. No project data or generated verification claims were altered. The new command `npm run verify:ab-runtime-parity -- CONTROL_BUILD CANDIDATE_BUILD` now compares SHA-256 hashes and presence of **all non-bundle static runtime files**, failing on missing or differing content; it deliberately ignores generated `index.html`, `sw.js`, and bundle/hashed assets, which naturally differ between candidate builds. It cannot replace DOM/visual equivalence, route/auth testing or proof of identical source inputs.

The corrected two builds matched on **56 public runtime files**, and a complete mobile DOM inspection showed **538 elements with no markup/text/geometry differences** after font load. Oracle jobs: initial browser mismatch `job-8dc17b326df8`, corrected parity `job-404935913c69`, static parity verified separately. Permanent implementation: `scripts/qa/assert-runtime-artifact-parity.mjs`, `scripts/qa/assert-runtime-artifact-parity.test.mjs`, package script `verify:ab-runtime-parity`. Four test cases cover equality, missing ignored files, changed runtime claims and bad arguments; they are included automatically in `verify:release-guards` via its `scripts/qa/*.test.mjs` pattern.

## Reassessed delayed ResizeObserver experiment

Candidate delayed the seven `ResizeObserver.observe()` calls in `useScrollAnchorTransition` until the first meaningful scroll; tests **7/7** and initial 320/390px browser navigation/scroll-back checks passed. First uncorrected A/B appeared to improve Lighthouse medians from **54 to 60**, but control runs were unstable and content differed. Second uncorrected A/B had control ~59 and candidate 53/59/60. These results are **not valid isolated code comparisons**.

With 56 runtime files aligned and **538 DOM elements identical**, three alternating mobile Lighthouse 13.5.0 pairs (A–B, B–A, A–B) yielded:

| Mobile Lighthouse median | Control | Candidate |
| --- | ---: | ---: |
| Performance score | 59 | 59 |
| FCP | 3,859ms | 3,889ms |
| LCP | 4,719ms | 4,776ms |
| TBT | 580ms | 553ms |

Raw reports `/tmp/postify-observer-equal-{control,candidate}-{1,2,3}.json`, Oracle job `job-47c194f1dc14`. The candidate had a small ~27ms TBT reduction but increased FCP/LCP; no robust improvement in the overall score. Earlier 3+3 mobile-menu runs (control 478/579/475ms, candidate 416/415/393ms) met the 900ms threshold but were recorded **before data parity**, so they do not prove a latency improvement.

**Decision:** restore the original observer behavior, preserve only the new static-data parity guard. Production continues **NO-GO**: no real Supabase staging A/B/C OAuth and RLS/CRUD confirmation, owner review of 81 historical visual goldens and About/Contact, native WCAG 2.2 AA, real mobile field p75, exact-source PR CI or release approval.
