# Postify — Premium Editorial Design System (working branch)

## Direction (2026-10-17)
Postify is a verified-knowledge product, not a social feed or generic startup dashboard. The UI should read like a sophisticated independent technical publication while preserving the clarity and efficiency of a reliable developer tool. The art direction uses an ink-green masthead, warm paper reading surfaces, distinctive editorial serif, restrained monochrome metadata and sparing terracotta/coral actions.

This is intentionally **not** a decorative-motion/glassmorphism redesign. Navigation, verification status, time-to-read, accessibility, search, authorship and evidence are the hierarchy. Do not introduce unsupported trust claims or ornamental animation.

## Shared tokens / rules
- The existing global tokens in `src/index.css` remain the single source of truth for base foreground/background/status colors, fonts, spacing, focus, motion and breakpoints. Old decorative indigo gradients have been mapped to the terracotta theme; semantic information states remain distinct.
- The new masthead is scoped to `src/components/Hero/Hero.module.css`, with locally declared `--hero-*` tokens (ink `#202721`, cream `#f4efe5`, warm coral `#edaa87`, paper `#efe8db`). Dark mode inverts the masthead to a light-paper panel against the site's dark surface.
- Heading voice: bold expressive serif, tightly kerned and line-height around 0.9–1.05 for display text; body type: readable sans, 1.55–1.84 line-height; small uppercase monospaced labels used sparingly for source/status/category.
- Primary action: solid coral with text contrast and visible keyboard focus. Secondary action: outline. Informational states: quiet neutral surface with a colored left rule.
- Images enhance content meaning; never degrade the clarity of title, publication status, evidence or reading time. Featured image crops maintain object-fit cover and safe fallback backgrounds.
- Motion is restricted to purposeful feedback (short surface/position/image response). Prefer transform/opacity, not scroll effects. `prefers-reduced-motion: reduce` disables transforms/transitions. Do not animate reading content unnecessarily.
- Responsive rules: 390 phone, 768 tablet, 1440 desktop are QA anchors; no horizontal overflow. Mobile auth places its form before the brand story. Sticky utility controls must not hide reading text or targets.
- Keyboard focus must stay visible for links, dialog, search, buttons, filters and form inputs. Touch targets should remain >=44px on mobile where actions are present.

## Changed UI surfaces
1. Home Hero: editorial ink masthead, dominant headline, refined featured paper card, improved search/CTA, responsive variants and themed inversion.
2. Shared Header: more confident logotype and legible navigation typography.
3. KnowledgeCard: non-decorative hover surfaces and improved card title scale.
4. Discovery feed: strong section title, quiet backend fallback notice. The front-page hero's actual featured post is excluded from the default feed by object identity to prevent duplicates despite different ranking.
5. Article: substantive pre-read summary in a clear paper module, restrained tools/hover surfaces, consistent cover radius and editorial summary typography.
6. Login: mobile form before brand storytelling, no need to scroll past marketing content to sign in.
7. Author/editor: sharpened format selector and publish action styles without touching validation, persistence or privileged routes.
8. Global design tokens: previously mismatched indigo gradient definitions consolidated into the warm terracotta language.

## Browser and regression evidence
- Chrome DevTools / remote Chromium baseline and after screenshots under Oracle-only `/home/ubuntu/.oracle-dev/visual/postify-*` (not committed).
- Desktop / tablet / mobile Chromium at 1440, 768 and 390 verified: Home, Article, Login, About, Contact each has a semantic h1, no horizontal overflow and no page JS errors.
- Searched zero-results flow, opened mobile menu, toggled light/dark, verified reduced-motion rendering, confirmed default feed doesn't duplicate masthead featured record.
- Focused Vitest Header/KnowledgeCard: 5/5 pass, ESLint pass; full `npm run verify`: knowledge verification, Vitest, lint, production build and smoke PASS under Node v24.22.0.
- Current V3 browser E2E `e2e/ui-v2.spec.js`: 7/7 focused critical tests pass (format nav, article, mobile home, login, card hierarchy, reduced motion).
- A separate legacy E2E suite `e2e/home.spec.js` expects obsolete DOM selectors (`[data-bento-item]`), not used as acceptance gate; do not change product HTML to accommodate obsolete tests.
- No server deploy, remote Git push, production database actions or original main-branch changes.

## Unverified / next
- Logged-in CreatePost, edit, profile/saved/authenticated backend states cannot be visually checked without a test account. Source CSS was improved without changing auth contracts; do not claim visual coverage.
- Re-run full `npm run verify` after final JSX adjustment and optionally the complete current V3 E2E Chromium suite.
- Review dark-mode and additional narrow screen details, stage/commit only intended source/docs on local worktree and save Oracle checkpoint/memory.
