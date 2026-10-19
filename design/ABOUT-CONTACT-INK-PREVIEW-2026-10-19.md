# Postify — violet-on-ink About/Contact actual implementation preview

**State:** Local isolated React/CSS candidate for CD-014, subject to owner review; *not* a synthetic AI illustration, approved visual baseline, or externally deployed preview. Scope restricted to `src/pages/AboutPage.{jsx,module.css}`, `src/pages/ContactPage.{jsx,module.css}` and non-screenshot contracts. Existing global PL-01/Home/Article/Author unchanged.

## What changed

- About: asymmetrical deep-violet editorial hero and purely decorative orb/typography specimen, real H1 + copy, jump to existing trust-model section. Keeps exactly four trust-model statements, four publishing formats and existing two internal CTA destinations. The old generic identical card grid becomes an indexed proof structure and a more considered format display.
- Contact: matching dark-violet composition, decorative (noninteractive, aria-hidden) CONNECT poster, real anchored jump to existing contact channels; existing **email/GitHub URLs**, three reason descriptions and existing correction reproduction note. No invented form, address, office hours, metric or submission state.
- Both pages: scoped per-page palette rather than global theme migration; text and actionable links contrast against dark backgrounds, visible keyboard focus, `prefers-reduced-motion`, 48px minimum new anchor target, desktop/phone breakpoints. TR/EN copy preserved.
- Progressive strategy: record `design/INCREMENTAL-RELEASE-STRATEGY-2026-10-19.md` in Oracle's replanned 5-stage task. This is a candidate for the **first private design review**, not a launch approval.

## Verified test evidence, exact local source

- Node24 Vitest **205/205 PASS**, Node release guards PASS, ESLint PASS, production Vite build PASS, security audit **0 known vulnerabilities**, separate 11-critical-file smoke against the **exact built output** PASS (entry JS **314094/320000 bytes**).
- New `e2e/visual/modern-ink-contract.spec.js` tests with prior `static-studio-contract.spec.js`: **32/32 PASS**, light/dark × 320/390/768/1440, real heading, viewport bounds, real contact/email/GitHub routes, four trust/four formats, focus ring, no fictitious form and Turkish 320px. First test draft mistakenly used a page-wide selector that matched identical footer/CTA links and yielded 8 false failures; test was corrected to scope links within `#main-content` and exact rerun yielded **32/32**. No application functionality changed for that test correction.
- Existing full product `e2e/ui-v2.spec.js` **68/68 PASS** on separately built exact-source Vite preview (not stale tracked `docs/` artifacts). No real hosted Supabase login/RLS checked.
- Real compiled Chromium screenshots saved under `/tmp/postify-20261019-violet-real-screens/{about,contact}-{light,dark}-{390,1440}.png` (8 full-page originals), plus four cropped **desktop/mobile** actual application preview compositions `*-preview.jpg`. Screenshot runs: document fonts loaded, zero page JS errors, document scrollWidth equals viewport width for all 8 cases. Captured public fallback only; no private user accounts.
- Artifacts imported into user-visible conversation as 4 JPEG files under `/mnt/data/postify-20261019-real-{about,contact}-{light,dark}.jpg` (local chat runtime only, **not** an Oracle VM source path). Screenshot-transfer temporary Google Doc deleted and temporary encrypted transport stopped. The screenshots are of actual coded pages, not rendered concepts.
- Light/dark hero intentionally dark in both modes. Existing application header and footer continue using previously approved PL-01 tokens.

## Still pending (release NO-GO)

- Owner must explicitly accept/critique **the actual coded** About and Contact screenshots, before updating any of their 8 historic golden snapshots; all 81 broader screenshot mismatches remain pending.
- Native manual WCAG 2.2 AA with real assistive technology, role/keyboard across the app, mobile/field CWV and performance budget acceptance, exact-source remote PR CI, isolated Supabase synthetic OAuth/session RLS/storage actor tests, approval of first public feature scope and production deployment **are outstanding**.
- No GitHub push, merge to main, external live preview URL, Supabase staging data mutation, production deploy or snapshot rebase was authorized or performed. Further progression is gated, even when local checks pass.

## Single-run mobile Lighthouse laboratory result

Same exact local production Vite build and Lighthouse 13.5 with simulated mobile network/CPU throttling, **one run per route**, no provider login: **About performance 81/100, FCP 3196ms, LCP 3638ms, TBT 164ms, CLS 0**; **Contact 80/100, FCP 3293ms, LCP 3730ms, TBT 161ms, CLS 0**. Raw JSON in Oracle temporary artifacts: `/tmp/postify-violet-lh-about.json` and `/tmp/postify-violet-lh-contact.json`; job `job-e5717e604edc`. These are neither a paired baseline-vs-candidate improvement measurement nor real field p75 Core Web Vitals, so **not production release acceptance**. Home route performance remains unresolved (~59 in earlier comparable lab).
