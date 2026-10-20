# Postify — Awwwards-level quality gates / 2026-10-20

Status: **local internal quality target, not an Awwwards award or jury rating.** Owner requested continuous screenshot → audit → critique → targeted fix → rescreenshot iteration. Production changes remain approval-gated. No paid services.

## Measurable rubric

Awwwards-inspired weighting: Design 40%, Usability 30%, Creativity 20%, Content 10% (published Awwwards scores). Internal threshold: **weighted >= 8.5/10**; Design >= 8.5; Usability >= 9.0; Creativity >= 8.0; Content >= 8.0. Scores must be explicitly justified with screenshots and practical evidence: not actual Awwwards jury scores. 0 = unusable/missing; 5 = generic but functional; 7 = deliberate, consistent and polished; 8 = distinct and cohesive across all tested views; 9 = unusually strong and memorable without usability loss; 10 = exemplary original craft under realistic constraints. Do not claim success based on scores alone.

For each route and light/dark × desktop/mobile, review each 0–10 component:
- Design: (type legibility and hierarchy; grid/whitespace; imagery and art direction; consistency across routes; quality of hover/focus/error/empty states). Mean of five, then cross-route mean.
- Usability: (findability/task success; keyboard focus/order; mobile/touch; legibility/accessibility; stability/performance). Mean, then cross-route mean.
- Creativity: (single explainable idea rooted in 'useful, verified knowledge'; signature moment; restrained choreography with off-switch; originality without interaction ambiguity). Mean of four.
- Content: (real, non-placeholder content; clear prose and CTA; context/evidence surfaced without noise; image/alt relevance). Mean of four.
- Weighted score = .40*D + .30*U + .20*C + .10*Content, no rounding for pass/fail.

## Non-negotiable functional quality gates

- UI route matrix: `/`, `/posts/ai-muhendisligi`, `/users/postify`, `/about`, `/contact`, `/auth/login`; light/dark at 390 and 1440 minimum, plus 320/768/1024 responsive sweep. Screenshots **fullPage**, not only viewport. Every visible defect logged, categorized critical/major/minor with before/after evidence.
- Must pass core flows: site navigation, search, topic/content-type filters, article access, bookmarking with expected auth/anonymous behavior, theme switch, dialogs, forms; no uncaught JS errors. Header/keyboard skip links and Escape behavior. No layout overlap, clipped interactive controls or horizontal overflow.
- Aim WCAG 2.2 AA with text contrast >=4.5:1 and large text >=3:1; visible focus, touch target ~44px practical target, keyboard/screen-reader manual testing required before claiming full conformance, respects prefers-reduced-motion.
- Target lab Lighthouse mobile >=90 performance, >=95 accessibility, >=95 SEO, >=90 best practices. Core Web Vitals LCP <=2.5s, CLS <=0.1, INP <=200ms at real-user 75th percentile; **field data unverified until a real dataset exists**. Lab checks are evidence but cannot replace field Core Web Vitals.
- Existing repository test suite and build smoke pass, JS entry budget <=320000 bytes. CSS/motion must not create perf regression. Review loading and empty/error states.
- Award-grade readiness requires no critical or major visual/UX defects across reviewed routes; each category threshold and weighted threshold passed; real owner/human visual review and independent reviewer warranted. Do not claim award or Awwwards rating.

## Iteration log

| Iteration | Full-page audit | Observed defects | Change | Verification | Weighted self-score | Status |
|---|---|---|---|---|---|---|
| 0 | 24 full-page images: 6 pages × 1440/390 × light/dark (`round0/`) | mobile 320px overflow; About and Contact visually duplicate; hidden lazy imagery misclassified as broken; originality insufficient | baseline only | initial route scans 24/24 HTTP 200 | **6.36 provisional** (D6.4 / U7.0 / C5.0 / Content7.0) | failed threshold |
| 1 | mobile full-page comparison (`round1/`) | Footer three tiny columns overflowed in Turkish at 320px; banner strong text not wrapping; decorative dither exceeded viewport | wrap status text, constrain dither, mobile footer single-column evidence rows | TR/EN 320/360/390/430/768 screenshot exact viewport width; no horizontal overflow | not separately scored | correction verified |
| 2 | 24 refreshed full-page images (`round2/`) | About / Contact repeated dark covers in light mode; lost theme distinction | About sage paper evidence poster; Contact warm oxide invitation and dark amber variant | 24/24 HTTP 200, 0 visible broken images, no overflow/pageerrors; 8/8 page-theme check; 16/16 basic interaction smoke; full `npm run verify` exit 0 | **6.77 provisional** (D6.9 / U7.5 / C5.3 / Content7.0) | **below 8.5 — continue** |

Stop only after acceptance criteria met with evidence, or explicitly report remaining failures and resume in next authorized work window. Existing public production must remain unchanged until explicit approval.

## First two review rounds — evidence and open issues

Evidence browser (on Oracle host): `http://127.0.0.1:4436/index.html` (local-only quality viewer; choose page, viewport, theme and before/after). Full screenshot PNGs and JSON reports live under `/tmp/postify-awwwards-audit-20261020/{round0,round1,round2}`; copy to protected Oracle evidence directory below. Screenshots are from the local design branch, not current production.

**Caution about scoring:** D/U/C/Content numbers above are assistant's calibrated editorial impressions, **not** an Awwwards jury decision or quantitative Lighthouse measurements. Usability ratings are low-confidence pending formal WCAG, real device and performance data. No target is certified even if these impressions improve.

Observed remaining items, ranked:
- **Major:** no single original, utility-driven Postify interaction/art direction distinguishes the product from generic high-quality editorial templates. Creativity below >=8 target; generic tech-photo direction still repeats.
- **Major:** mobile article's persistent reading actions need focused occlusion and keyboard testing; existing responsive screenshot scan alone cannot prove comfort or non-obstruction.
- **Major:** field 75th percentile LCP/CLS/INP unavailable and mobile Lighthouse not yet run. Cannot certify Core Web Vitals or WCAG 2.2 AA from automated screenshots.
- **Moderate:** remaining author/about/contact/login section rhythms, error and empty states, dark theme, and original imagery need another full route-by-route design pass.

The 24-route matrix is a capture/audit, **not** automatically an Awwwards-level pass. Continue the deliberate loop, hold production release until owner approval.

References: Awwwards examples [SOTD criteria](https://www.awwwards.com/sites/okkapi-agency); Google [Core Web Vitals](https://web.dev/articles/vitals); W3C [WCAG 2.2](https://www.w3.org/TR/WCAG22/).
