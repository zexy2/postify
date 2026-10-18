# Postify — Article and public author visual acceptance review (18 Oct 2026)

**Decision: visual acceptance PENDING.** This is a local QA review, not owner approval of the Article or Author layouts, and not a deployment signoff. It preserves all existing golden images and the 0.001 screenshot tolerance. It is consistent with the previously approved `INNER-02 Evidence Marginalia + INNER-01 Reading Folio` approach, but visual direction is not pixel-level acceptance.

## Exact comparison evidence

The 2026-10-18 complete visual inventory found **14 Article/Author failed screenshots**, of which four are image dimensions and ten are same-size pixel differences. A separate focused rerun on the current isolated source included those fourteen existing screenshot checks **plus six new non-screenshot semantic/responsive Article QA checks**. Its result was **6 PASS, 14 FAIL (visual screenshots only)**. The runner returned 1 as expected; the wrapper recorded the failure without claiming a green visual suite. The local test report is `/tmp/postify-article-author-visual-final-20261018.json` (do not conflate wrapper exit 0 with screenshot test success).

| Test surface | Old expectation → actual pixels | Cases | Current interpretation |
| --- | --- | ---: | --- |
| Article detail, 1440px, light/dark | 1440×2940 → 1440×2961 | 2 | ~21px vertical increase; evidence callout, typography and image position visually shifted; needs art-direction signoff |
| Article detail, 390px, light/dark | 390×3097 → 390×3150 | 2 | ~53px vertical increase; reading masthead and preview callout spacing shifted; no obvious clipping in first comparison; precise visual approval pending |
| Author portfolio, 1440/390px, light/dark | Equal screenshot dimensions; pixel difference 7–11% | 4 | Typography and warm newsprint surfaces differ; 390px cover/profile content continues below viewport, not considered a bug without a functional failure |
| Author not-found desktop/mobile | Equal viewport dimensions; pixel difference 5–9% | 2 | Heading line wrap, margins, background shade and CTA position differ; recovery action still appears, visual acceptance pending |
| Author service unavailable desktop/mobile | Equal image dimensions; pixel difference 5–6% | 2 | Text placement, hue, spacing drift; retry affordance visible in screenshot; exact acceptance pending |
| Author published-work unavailable desktop/mobile | Equal image dimensions; pixel difference 2–4% | 2 | Same-size style drift; actual live data untested, review expected/fallback text semantics |
| **Total** | **4 height mismatches + 10 pixel mismatch cases** | **14** | **No golden baseline updated** |

The first **Article** comparison includes all four desktop/mobile light/dark states in `/tmp/postify-article-comparison-small-20261018.jpg`. A separate public author comparison in `/tmp/postify-author-mobile-comparison.jpg` shows author portfolio, unknown author, and unavailable service states. These are screenshots from Oracle-local Playwright artifacts, not a staging or production user session. The images were displayed in ChatGPT for human visual review. Interpretation is a **triage finding**; exact layout decisions still need the owner's acceptance.

## Independent functional/geometry release guard

Added `e2e/visual/article-release-contract.spec.js` for **6 scenarios (light/dark × 320/390/1440px)**, run against a local Vite source server with no Supabase credentials. All **6/6 passed**. Checks: semantic article H1 and title, labeled quick-brief region, visible cover image with meaningful nonempty `alt`, readable on-screen heading geometry, no horizontal document overflow, and ≥44×44px accessible-name mobile article toolbar buttons. The guard deliberately does **not** include screenshot comparisons, so its success is not permission to rewrite visual goldens or a comprehensive WCAG 2.2 AA signoff. The original public author missing/error visual tests already assert visible recovery links/buttons, min44px touch height at mobile, and no horizontal page overflow before the snapshots; the focused rerun got through those asserts and failed on screenshots alone.

## Actions before full visual CI can pass

1. Review **Article desktop/mobile light/dark** typography, quick outcome block, image position, word wrapping, and mobile bottom bar. Compare to approved INNER-02/INNER-01 and the shown screenshots. If the visual direction is accepted, document scope-specific approval and update **only these four approved Article** golden PNGs after a fresh, reproducible capture. Otherwise fix confirmed typography/spacing/clipping bugs first.
2. Independently review **Author** public profile and all three fallback/error surfaces, including TR copy/long display names, 320px width and native zoom. Do not infer acceptance from the Home/Article approvals; do not update these ten images without a design decision.
3. Re-run the **complete visual suite**, including six added functional cases. A passing Article visual subset is not a substitute for the site-wide CI gate. Real staging Supabase identity/RLS, manual screenreader and performance release acceptance remain mandatory before merge/deploy.

**No production user data, Git push, screenshot golden file or deployment was changed during this review.**

## Whole-site visual CI rerun after six new contracts

The **entire** `playwright.visual.config.js` Chromium suite was rerun on the same local source after adding the six Article contract cases. It now contains **121 scenarios**: **40 PASSED, 81 FAILED, 0 skipped/flaky**. All 81 unexpected failures were confirmed `toHaveScreenshot` image comparisons; no functional assertions failed in the six added Article cases or the other passing cases. Playwright's runner exit was **1 (expected for failed golden images)**; the Oracle wrapper exit 0 recorded the result for audit, not a successful visual build. Full report `/tmp/postify-release-visual-after-article-review.json`, SHA-256 `36f76ff2f7fe2af329735c696e8f4f1402e21ec079a1f00051704ef7187ef0cf`, imported into Oracle as **failed QA** event `ev-c6d90a4407b920a7bd69`. Full release remains **NO-GO**; adding functional tests did not waive acceptance of the 81 unapproved snapshots.
