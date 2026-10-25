---
name: postify-ui-review
description: "Use for every Postify UI/UX change. Enforces an editorial + developer-tool visual system, real browser review, responsive quality, accessibility, and anti-template checks before considering UI work complete."
---

# Postify UI Review

Use this skill for any task that changes Postify's visible interface, interaction model, information hierarchy, or responsive behavior.

## Product direction

Postify's identity is "show your work": a test-report / engineering-notebook language where evidence is the loudest thing on the page. Report paper, graphite ink, a single cobalt evidence colour, amber for recheck. The site should feel authored and memorable, not like a template, and every bold moment must be made of real product data.

## Hard rules

- Spend boldness in one place per page (hero proof receipt, Goal scroll scene); keep everything around it quiet.
- Decoration must encode information: graph-paper grid = notebook page, stamps = verification state, evidence rail = trust level, cover figure = content type. No unexplained gradients, glow, glass, marquees or ambient animation.
- No all-caps monospace micro-labels, no middle-dot meta strings, no fake ordinals, no single-word italic accents in headlines.
- Do not use fake social proof, fake activity, fake verification, invented counts, or unsupported trust labels. Stamps and receipts render published artifacts only.
- Motion explains state change, is interruptible, lazy-loaded per route, and fully disabled under `prefers-reduced-motion`.
- Mobile is designed, not scaled: check touch targets, sticky docks, overflow and 400% text separately.
- Accessibility is a release gate: keyboard navigation, visible focus, semantic headings, labels, contrast.
- A passing build is not proof of a good UI.

## Required workflow

1. Query Graphify first when `graphify-out/graph.json` exists. Identify the page, its shared components, and likely impact radius before editing.
2. Inspect the current page and relevant shared styles/components. Prefer deleting visual noise over layering more CSS on top.
3. State the user-facing problem being solved in one sentence before implementation.
4. Implement the smallest coherent redesign slice that creates a clearly visible improvement.
5. Run focused tests plus lint/build as appropriate.
6. Open the real page in a browser/Playwright and inspect it at minimum at 1440px and 390px widths.
7. Check these failure modes explicitly:
   - generic template / portfolio aesthetic
   - weak content hierarchy
   - excessive empty space
   - too many cards/borders
   - inconsistent type scale or spacing
   - decorative effects competing with content
   - navigation clutter
   - hidden or ambiguous primary action
   - mobile overflow or cramped controls
   - trust/evidence labels that overclaim
8. Capture/compare screenshots for major surfaces. For V3 baseline coverage prioritize Home, Article, Editor, and mobile Home/Article.
9. Re-query/update Graphify after code changes when useful: `graphify update src` or rebuild the focused graph.
10. Do not call the UI task complete until visual browser inspection is clean.

## V3 priority order

1. Global visual system and header/navigation
2. Home page hierarchy and content discovery
3. Post card system
4. Article reading/trust surface
5. Create/Edit editor and evidence inspector
6. Profile, bookmarks, knowledge dashboard
7. Empty/loading/error states
8. Motion/polish only after layout and hierarchy are stable

## Acceptance bar

A successful change should make an unprompted user notice that Postify looks more coherent and mature without needing an explanation of what changed. If the improvement is mainly visible in code, tests, or architecture rather than on the page, it is not sufficient for a UI V3 milestone.
