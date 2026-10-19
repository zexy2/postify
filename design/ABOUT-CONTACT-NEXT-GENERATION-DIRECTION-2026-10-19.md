# Postify — About / Contact next-generation visual direction (2026-10-19)

**Status:** user preference indicated, **design concept only**; not a coded screenshot, owner pixel acceptance, global palette replacement, authorization to rebaseline visual tests, push, merge or deployment. Source: the most recent conversation's AI-generated violet-on-ink side-by-side conceptual mockup and user's short **“Tamqm”**. The mockup is not a current browser capture, functional prototype, source design file, or a guarantee of exact implementation. Record the response as agreement to explore this *direction*, not unconditional approval of every depicted element.

## Why revisit

The current About/Contact Studio implementation uses dark forest/oxide mastheads, contemporary sans-serif headings and numerous conventional rounded card grids. The owner requested **more modern** and reviewed a subsequently illustrated dark violet concept. The existing direction remains code baseline only; do not silently approve its 8/8 screenshot mismatches or overwrite old goldens.

## Scoped visual direction — exploration to implement in isolated Postify worktree after review

- **Ink-first immersive surfaces:** very dark neutral-violet canvases, carefully localized luminous violet highlights and restrained bloom. Avoid high-contrast neon everywhere; maintain WCAG2.2 AA legibility, native light/dark semantics, preferring fewer stronger accents.
- **A recognizable editorial identity:** oversized but responsive type with considered asymmetric compositions and authored visual storytelling. Avoid generic SaaS kits with repeated identical four-corner cards, invented illustrations, or a gratuitous hero model.
- **About page:** expressive visual introduction rooted in the *existing* practical-knowledge/evidence value proposition. Keep all four trust principles, all four publishing formats, semantic section headings, and working internal CTA routes. Instead of generic cards, vary editorial hierarchy (one or two large narratives with an indexed proof/system map). Use existing localized TR/EN copy without fake platform statistics.
- **Contact page:** lead with a single clear action and verified existing **mailto and GitHub channels**, then correction, useful-topic, collaboration rationale plus reproducible-correction note. Neither a working form nor a submission endpoint exists in this route: the mockup's form, assumed email, business hours, office address and auto-delivery assurances are **illustrative fabrications, not product requirements**. Implement a form only after separately choosing and verifying a secure backend, spam protection, validation, retention/privacy and actual delivery.
- **Motion:** calm layered parallax/hover and focus feedback only where they improve interaction, with `prefers-reduced-motion` and low-power mobile defaults. No layout shift, scroll traps, or animated loading barriers.
- **Theme and global tokens:** previous PL-01 Oxide & Newsprint (CD-003) and Home/Article/Author directions remain binding *elsewhere*. Any violet palette is **scoped as an About/Contact alternative until the owner explicitly approves a global brand/color-system change**. Do not recolor Header, Home, Article, Knowledge or task screens as a side effect.

## Implementation order / constraints

1. **Content-and-affordance parity:** map each existing About/Contact landmark and destination to candidate layout. No new pseudo-functional controls, false success feedback, fabricated counts or addresses.
2. **Typography and spacing:** draft explicit mobile 320/390 and desktop 820/1440/1920 geometries with no overflow; cover both TR/EN and light/dark with actual shipped fonts.
3. **Visual implementation, isolated branch:** change only About/Contact JSX/CSS modules plus named fixture-only tests. Keep the rest of the application and live site unchanged. Reuse accessible semantic markup, visible focus, minimum 44px tappable actions. Use reproducible Vite artifacts.
4. **A/B and functional protection:** use `npm run verify:ab-runtime-parity -- CONTROL_BUILD CANDIDATE_BUILD` to ensure public knowledge/verification data matches, then compare screenshots/DOM and non-screenshot contracts. Run Vitest, lint, build/smoke, a11y contrast, real keyboard/zoom, route navigation, offline/slow CPU; check mobile Lighthouse and TBT/FCP/LCP, rather than claim speed from style changes alone.
5. **Owner review:** deliver **actual coded Chromium screenshots** of new candidate side-by-side with reference at matched viewports, clearly labeled *code preview*, not AI image; let user approve or request changes for About and Contact separately.
6. **Release gates unchanged:** 81 pending historical screenshot mismatches (8 About/Contact), isolated synthetic Supabase staging OAuth/session/actor RLS/CRUD, real manual WCAG2.2 AA, mobile field p75 CWV, exact-source CI, separately authorized push/merge/deploy. **Production NO-GO.**

## Explicit decision boundary

The owner's “Tamqm” after seeing a purple AI **concept** authorizes proceeding with a *design investigation* in this narrowed direction. It does **not** establish consent to publish, invent a message form, claim the AI images are implemented code, refresh 81 snapshot goldens, or replace the already approved global design tokens. Treat any future owner request for a sitewide violet redesign as an architectural/design-system choice needing its own scope decision.

## 2026-10-19 OWNER CORRECTION — SUPERSEDED ART DIRECTION

Do not implement violet from this earlier AI concept. The owner explicitly reminded us that brand colors had already been selected: CD-003 PL-01 Oxide & Newsprint. CD-016 overrides the violet-specific paragraphs above. Keep editorial/typographic ambition while using ONLY PL-01 across About/Contact.
