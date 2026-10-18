# Author Studio — modern public writer portfolio (review proposal)

**Design candidate, awaiting owner visual approval (18 Oct 2026).** The user explicitly agreed to the assistant's proposal to adapt the approved modern **Article Studio** language to the Author/public-profile screen and **show real screenshots**. This does *not* approve final pixels or author sitewide visual goldens, production merge, deployment or an authorization/schema migration.

## Intended presentation

- A dark evergreen, gently textured **Postify Authors** masthead on both light/dark themes, with structured author/editor role identity, legible contemporary Inter lettering and the actual author's display name, handle, and bio. The abstract ring and initial are **aria-hidden decorative art**, not an invented portrait or profile credential.
- Rounded muted-celadon **Explore published work** link at ≥44px moves keyboard users directly to the labelled/anchored real published work section. Content remains server-provided; no invented followers, verified status, view counts or profile metrics.
- Three elevated summary cards preserve the **existing real publication count, computed total reading minutes and evidence-based author-tested count**. They draw from the same loaded posts; service-unavailable state still explicitly shows its retry affordance.
- A clear **Published work** section with the existing `EditorialFeed`, bookmark toggling and 44px reachable actions unchanged. No new authenticated operations or data writes.
- Matching premium **not-found and unavailable-service** surfaces with visible named recovery controls, 320 CSS-pixel reflow and `prefers-reduced-motion` support.
- Desktop/390px/320px, both themes. The dark masthead surface is purposeful also in light theme to match Article Studio and the owner-approved dark Home direction. Scope is **only `UserPage.jsx` and `UserPage.module.css`** plus a new local browser QA contract. Existing Article and Home designs remain unchanged.

## Source and QA

- `src/pages/UserPage.jsx`: show the decorative masthead wordmark, readable profile introduction, purely decorative oversized monogram, anchor CTA to `id="published-work"`; keep real stats, author role and SEO intact.
- `src/pages/UserPage.module.css`: implement cohesive hero, profile/stat-card overlap, mobile editorial layout, recoverable error surfaces, focus-visible outlines and reduced-motion handling.
- `e2e/visual/author-studio-concept.spec.js`: **9 isolated Chromium cases** (6 live fallback author profile light/dark × 320/390/1440, plus 3 mobile missing-author or service/published-work-error states). Require visible H1, author role, correct dark gradient token, ≥4.5:1 H1 contrast, ≤1px document overflow, main content and published feed, 44px anchored CTA, real summary group and functional author recovery controls. No external authentication or Supabase data writes.

## Visual review material

Actual isolated-browser screenshots (not image-generator mockups):

- `/tmp/postify-author-studio-light-comparison.jpg` — light theme: desktop left, mobile right.
- `/tmp/postify-author-studio-dark-comparison.jpg` — dark theme: desktop left, mobile right.
- `/tmp/postify-author-studio-{light,dark}-{320,390,1440}.png` — actual individual browser screenshots.

For iPhone-visible previews, synthetic public fallback-author screenshots were temporarily transferred to publicly openable JPG links. These previews contain only local fixture/public fallback content, no credentials or private user records. Images are temporary; the source of truth remains the isolated Oracle worktree.

## Release restriction

**NOT approved for production.** The full CI visual suite previously returned 40/121 pass and **81 old screenshot mismatches**. This new author profile intentionally modifies some of the old author golden images. Do not mass-update references or relax image tolerances without owner review. Real nonproduction Supabase OAuth/RLS, manual WCAG2.2AA and mobile performance release gates remain open, as does separate explicit merge/deploy authorization.

## Final local proof — 2026-10-18

- Independent `npm run verify:knowledge`, Vitest **205/205 PASS**, release/staging guard **7/7 PASS**, ESLint clean, Vite PWA production build and 11-asset smoke (314,094 / 320,000 entry budget), `npm run verify:security` audit 0 vulnerabilities. Node24 verified environment is local; remote CI still needs exact-commit testing.
- Chromium product E2E **64/64 PASS** and new Author Studio functional/responsive/error **9/9 PASS**, across light/dark × 320/390/1440 and three safe error cases. The rendered page had 0px horizontal overflow in sampled viewport states. Oracle evidence imports: Vitest `ev-886a8e434a0a4a6fb69f`, full Chromium `ev-d36b57d5a188a4fea500`, Author contract `ev-8ad57e053ca124b0f6da`.
- Eight former author-profile/error golden snapshots were explicitly rerun with `toHaveScreenshot`, and **0/8 matched** the new layout. Every error was a screenshot difference; no functional assertions failed in those cases. Oracle failed QA evidence `ev-1056ce4889163a6f27db`, SHA `2930efddebe37803c0296bdfa1f7a7a1633b00cde7b704fcd5d7cefd21fc8ae6`. The visual screenshot baseline is deliberately **NOT updated**. The full visual suite's prior 81 failures remain release-blocking (this is only an eight-case targeted rerun, not a new full site-wide visual result).
- Actual preview images for synthetic fallback author were uploaded temporarily as external JPGs so they can open on iPhone: `https://tmpfiles.org/dl/1792343050.929f6feb09597a59/wJAqcTCus4l6/postify-author-studio-light-comparison.jpg` and `https://tmpfiles.org/dl/1792343050.4387b42888e79675/woAgcwCesQym/postify-author-studio-dark-comparison.jpg`. Links are ephemeral and not a controlled archive; the local untracked PNGs and JPEGs under `/tmp` are the work-in-progress record. The images contain no passwords or real user accounts.

**This outcome demonstrates a working prototype, NOT final design approval or production release readiness.** Must wait for the author's visual acceptance before replacing goldens, while staging Supabase, real screen-reader/WCAG, performance target and CI/release gates remain open.

## Later owner decision addendum — design direction approved

After reviewing light/dark Author Studio preview images, the user answered **“guzel”**, explicitly approving the proposed Author Studio visual **direction**. This is recorded in CD-013. Earlier passages showing pending describe the original candidate state. Exact golden snapshot pixels, staging and production release approval remain open.
