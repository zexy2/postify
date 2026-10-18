# Postify — Article Studio concept B (review prototype)

**2026-10-18 — NOT YET DESIGN-APPROVED, NOT DEPLOYED.** The user rejected the previous old-fashioned magazine-like Article page and asked for a more modern appearance. This is a fully implemented **isolated-branch experiment**, not a product-owner signoff or release authorization.

## Concept

Replace the old tight, columnar Fraunces article masthead with an immersive dark-forest editorial panel on both light and dark themes. Introduce a contemporary high-contrast Inter headline, large balanced typography, authentic type/category/reading-time and verified-evidence metadata, layered botanical geometric gradients, an author identity within the cover, and a near-full-width photographic image visibly overlapping the rounded hero. The meaningful `Before you read`/expected-outcome card moves **after the image**, with an accessible section name, its existing outcome copy, a soft secondary surface and an ornamental directional mark. Reading content retains existing semantic structure, evidence/source verification, comment actions, bookmark copy/back affordances, share semantics, reading progress and mobile fixed toolbar. Use 320/390/1440 responsive layouts, both themes, without applying new styling site-wide.

This is **not** a generic neon dashboard and does not fabricate credibility badges, counts or content. The Home CD-012 dark editorial direction remains unchanged; the Article layout is an independent design proposal awaiting specific owner feedback.

## Implementation scope

- `src/pages/PostDetailPage.jsx`: add a decorative, aria-hidden Postify Journal edition line; reorder cover above existing quick brief while preserving its accessible label, authored outcome, article body, SEO and metadata.
- `src/pages/PostDetailPage.module.css`: temporary, clearly labeled **Article Studio concept B** style override section (to be consolidated into base CSS after visual approval or reverted if rejected), with modern hero, typographic scale, overlap cover, outcome card, refined toolbar, and light/dark/mobile styles.
- `e2e/visual/article-studio-concept.spec.js`: six responsive/themed non-screenshot contracts checking appearance, reading semantics, accessibility, hero and CTA containment and 44px mobile tools. Existing six Article release contract tests and the product regression suite remain mandatory.

## Local preview images

- `/tmp/postify-studio-ai-comparison-light.jpg`: current `/posts/ai-muhendisligi` light-theme desktop/mobile actual Chromium screenshot collage.
- `/tmp/postify-studio-ai-comparison-dark.jpg`: same in dark theme.
- `/tmp/postify-modern-article-light-1440.png` and width390/320 variants, plus dark: longer technical title stress case `/posts/node-json-dogrulama`.

In actual browser measurements the technical title hero height was reduced from ~837px to ~685px at desktop after scale optimization. The real fallback Article `An AI feature is a system, not a model call` reached ~610px desktop/~531px mobile at width390/~572px width320. All observed document horizontal overflows were 0px; these are browser observations, not exhaustive WCAG/field performance proof.

## Open QA and decision

**This document records a candidate for review only.** Its concept and new screenshot baselines require separate approval. The previous full visual CI was already **40/121 pass, 81 screenshot mismatch fails**, and this new layout intentionally changes the four Article snapshots further, so **do not** overwrite old screenshots blindly, waive the release gate or claim that QA-02 / QA-03 acceptance is complete. Need proper owner approval, complete visual review and accessibility including genuine 400% and assistive tech, a safe staging RLS environment, exact-source CI, and separate permission before any push/main merge/production Pages deployment.

## Safety and actual local testing (not production)

- Tested six Article Studio-specific cases plus the six previously added Article semantic/mobile safety cases at 320, 390 and 1440 CSS pixels in both themes: **12/12 PASS** after final styling, including 44px mobile toolbar hit areas, zero horizontal overflow and picture accessibility.
- Discovered a real accessibility bug in the first prototype: the global light-theme `--success` green used by the *author-tested evidence label* was poorly contrasted against the dark cover. Scoped its foreground to accessible soft green on the dark hero regardless of the surrounding theme and added an explicit **≥4.5:1 evidence-badge contrast** check to all six new Article Studio tests. Stale and Postify-verified states also receive suitably light alert/accent colors inside the dark cover. Tests were rerun after the fix and passed.
- Actual dedicated isolated-Xvfb/native-Chromium QA: **27/27 page/geometry states** at 100%/200%/400% browser zoom and **8/8 bounded keyboard focus sequences** passed (no new horizontal overflow or sampled occluded focus). These are automated samples, not an entire manual WCAG2.2 AA signoff.
- The full product suite previously passed **64/64 Chromium** and complete Vitest/release-guard/lint/PWA/build/security validation on the prototype; exact-source final full QA is recorded separately after final evidence-label fix. The project still has previously unaccepted full visual snapshot changes (last known **81 failures**), real Supabase staging OAuth/RLS and manual accessibility checks open. No snapshots updated, no deployment.

The hero's reworked deep-ink surface and sans-serif title **have not been approved by the owner yet**; this is shown in ChatGPT for feedback and can be reverted independently. A follow-up approval should decide whether to consolidate the temporary style overrides into the permanent component and begin controlled snapshot rebaseline review.

## Final local experimental QA results — 2026-10-18

- Final source `npm run verify` **PASS**: 205/205 Vitest in 48 suites, 7/7 release/staging fail-closed guards, no ESLint warnings, knowledge contract verified, Vite PWA build and smoke 11 critical outputs with the entry JS **314094 / 320000 bytes**. `npm run verify:security` **PASS**, npm audit 0 known vulnerabilities. Runtime gate still warns verified Node version v24.21→24.22 needs recheck, not falsely called a full production freshness pass.
- Final 64/64 existing product Chromium E2E **PASS**; 12/12 (six preexisting plus six concept-specific) Article responsive checks light/dark at320/390/1440 **PASS**, including dark-cover verification-label text contrast ≥4.5.
- Dedicated real Chromium native 100/200/400% zoom reflow: **27/27 PASS**; 8/8 bounded keyboard Tab focus checks **PASS**, zero observed horizontal overflow or occluded samples; no manual screen-reader certification.
- Oracle recorded structured reports: Vitest `ev-34b12d903faffeff3b77`, product E2E `ev-0bbf159ff788da82123c`, Article semantic/theme `ev-7230dff254289c3a5d96`, native zoom `ev-a4100d683d349e079de3`. All tests ran against the local source before its tentative commit; do not present those imports as separate independent commit-SHA verification.
- Visual snapshot comparisons were intentionally **not updated**. The previously observed 81 old screenshot mismatches and real staging Supabase auth/RLS, manual WCAG, performance release acceptance, and explicit owner deployment approval remain **NO-GO**.
