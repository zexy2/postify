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

| 3 | 24 refreshed full-page images (`round3/`) + actual Chromium hover GIF | Motion absent or generic; article already had a functional reading progress bar so a second CSS bar would be incorrect; floating mobile toolbar obscured reading content | One deliberate masthead arrival, hover-triggered editorial photo inspection sweep, interactive proof-trail card underline; reused/repositioned existing reading-progress bar below header; shortened mobile reading dock with intact 44px controls | `npm run verify` PASS: 163/163 unit tests, lint, build, 13 critical assets and 2 route shells, JS 319999/320000 bytes. Playwright motion/reduced-motion matrix 16/16 after correcting test selector; final home/article UX matrix 24/24. Full-page matrix 24/24 HTTP200/no overflow/no broken visible images/no pageerrors. Hover animation recorded as `postify-photo-inspection.gif`. | **7.00 provisional** (D7.1 / U7.6 / C5.9 / Content7.0) | **below 8.5 — continue** |

| 4 | 24 full-page views (`round4/`), original artwork PNG/WEBP and 8-case TR/EN theme checks, browser QA gallery | Hero/gallery tech stock photography made verified knowledge feel generic; SEO missing robots.txt and vague CTA; mobile performance missed release gate | Replaced 4 core article covers with Postify-original artwork (AI verification lens, semantic web structure, frontend timing signal, developer pipeline). Kept editable SVG master files in `design/artwork/postify/`, generated 1200/800/480px optimized WebP and preserved image paths/srcsets. Added valid `robots.txt`, changed generic CTA translations. | `npm run verify` EXIT0: 163 unit tests, lint/build, 13 artifact smoke, 2 public route shells, main entry **320000/320000 bytes**. Browser 24/24 full-page routes (390/1440 × light/dark), 8/8 interactive TR/EN asset/link smoke, zero overflow/JS errors/broken visible images. **Mobile Lighthouse local compiled build: performance 71→74, accessibility 100→100, best-practices 100→100, SEO 85→100; LCP still 4.1s**, CLS 0. See `lighthouse-round4*.json`. | **7.40 provisional** (D7.5 / U7.6 / C7.0 / Content7.2) | **below 8.5; performance still fails** |

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

## Round 3: measured motion without JavaScript payload growth

- **New content:** Homepage masthead composited intro (`transform`/`opacity`), one-shot scan across featured image on mouse or keyboard intent, and compact proof-trail accent on Home discovery card hover/focus. Motion is disabled when `prefers-reduced-motion: reduce`.
- **Existing functionality preserved:** The article already had a `ReadingProgress` component with scroll listener and accessible ARIA `progressbar`; the duplicate scroll-timeline CSS was discovered and removed before delivery. The retained component is repositioned immediately below sticky site header. Its real numeric progress increases on reading scroll.
- **Readability:** Mobile article dock moved closer to safe bottom edge, reducing occluded vertical strip from ~69px to ~49px at 390px, while keeping 44px tap targets and original bookmark/share/back/comments behavior. **Some overlap remains while reading; merits another interaction study** rather than claiming it solved all occlusion.
- **Evidence:** `round3/` 24 full-page PNG screenshots and `postify-photo-inspection.gif` served from local QA viewer `http://127.0.0.1:4436/index.html`. No false promise of a direct sandbox download path.
- **Next primary gaps:** bespoke Postify-specific visual storytelling and original image system, repeated card/section density across routes, full manual WCAG keyboard/screen-reader validation, actual Lighthouse mobile lab report and real-user 75th percentile CWV, production direct-route HTTP 404 on some static deep links. The current 7.00 score remains a *self-evaluation* and release is not authorized.

## Round 4 — original evidence artwork and first mobile Lighthouse evidence

- Four original artworks replaced generic photographs on the corresponding editorial posts without modifying post ids/links or product content, with editable SVG masters in `design/artwork/postify/` and optimized WebP versions at the existing image paths in `public/images/posts/` and `responsive/`. Some other post images still need the art direction treatment; do not claim a unified complete visual system.
- Before/after can be seen in the Oracle-hosted local quality gallery `http://127.0.0.1:4436/index.html` (round3 → round4). The gallery includes four source-derived visual examples and full-page screenshots.
- Real Lighthouse mobile lab against **compiled local preview** port 4437, not the dev server: baseline P71/A100/BP100/SEO85 LCP 4.1s, after static robots and descriptive CTA P74/A100/BP100/SEO100 LCP 4.1s. Variation in performance score should not be attributed causally without repeat runs; field p75 INP/LCP/CLS remains unavailable.
- Release-blocking findings: mobile performance 74 < target 90 and LCP 4.1s >2.5s. Audit points to LCP image not discoverable in initial HTML, main-thread JS work, initial CSS/font requests, and oversized images in ordinary cards (the homepage hero uses responsive srcset; standard cards still use full-size webp). Next loop: improve initial asset discovery and responsive card imagery **without harming other routes**, compare several Lighthouse runs, and only then consider further visual enhancements.
- Usability: existing mobile article dock still can cover text during scroll; do not call fully solved. Manual WCAG 2.2 AA, screen-reader and real-device checks not done; Lighthouse 100 accessibility is only automated lab evidence.

**Rubric scoring disclaimer:** 7.40 is an internal expert-opinion estimate, not an official Awwwards rating or proof of passing the technical gates. Awwwards target not achieved. No push, no deployment or production data writes.
