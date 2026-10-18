# Postify — About / Contact Studio design proposal

**2026-10-18: local candidate for owner visual acceptance; not yet approved or deployed.** User asked to continue after accepting modern Article Studio and Author Studio design direction. We adapted the same deep-forest ink + warm newsprint + sans-serif editorial hierarchy specifically to public About and Contact routes. No new form/data processing, publishing, role settings, Supabase calls or third-party scripts were introduced.

## Visual direction and preserved behavior

- **About:** dark gradient masthead with subtle concentric rings and contemporary Inter heading; restrained POSTIFY ABOUT motif; existing practical-knowledge statement and all four exact trust principles preserved; two-column card presentation for those principles; four format descriptions in their own cards; Explore Knowledge and Write a Useful Record continue to their original internal routes as keyboard-reachable 48px pills.
- **Contact:** matching dark, responsive editorial masthead; existing localized correction/collaboration introduction; the *same existing* `mailto:` e-mail and GitHub identity URLs, visually promoted into clearly distinguished interactive channel cards. All three existing correction/topic/collaboration reason descriptions and the existing reproduce-a-correction note preserved. No fake contact form, implied submission capability or invented contact information.
- **Responsive:** local Vite Chromium actual screenshots at 320/390/1440 CSSpx, light/dark. Both pages have no horizontal document overflow in sampled viewports, visible semantic headings, ≥44px actions, reduced-motion-supporting Contact hover treatment and keyboard focus outlines; the dark masthead is intentionally dark in both themes.
- **Accessibility:** purely decorative edition marks are `aria-hidden`, original heading/region names and localized TR/EN copy preserved. Modern H1 contrast, actual distinct link destinations and useful focus/hit targets are checked separately in 14 independent browser cases.

## Source scope

- `src/pages/AboutPage.jsx` decorative edition line only; text and all four trust + four format records unchanged.
- `src/pages/AboutPage.module.css` clean scoped Studio layout and responsive trust/format card styling.
- `src/pages/ContactPage.jsx` decorative edition line only; contact destinations untouched.
- `src/pages/ContactPage.module.css` clean scoped Studio layout for existing channels and reasons.
- `e2e/visual/static-studio-contract.spec.js`: light/dark × 320/390/1440 for both pages (12) plus TR content at 320 (2) = **14 non-screenshot contracts**, checking heading contrast ≥4.5:1, dark gradient, 16px+ radius, geometry/no horizontal overflow, preserved links/cards/hit targets and Turkish headings.

## Actual browser review images

Four full-page-cropped local comparisons (left desktop, right mobile) at `/tmp/postify-static-{about,contact}-{light,dark}-show.jpg`, backed by original individual full-page screenshots `/tmp/postify-static-{about,contact}-{light,dark}-{390,1440}-full.png`. Images were also shared as temporary direct HTTPS image links in chat for user review. Public images show only existing public/site content, with no private account data or secrets.

## Strict release boundary

**About/Contact visual direction still requires explicit owner approval.** These two routes had historical golden image drift already; no golden PNG has been rewritten and no global screenshot tolerance changed. Current full-site visual gate already had **81 unapproved screenshot mismatches** (last measured after 121-case suite); targeted About/Contact visual checks are expected to differ because of intentional new page styles. In addition, real nonproduction Supabase identity/RLS checks, manual screen-reader/WCAG2.2 AA acceptance, performance release signoff and separately authorized production merge/deploy remain required. Test passes on this isolated branch are not authorization to publish.

## Final local QA evidence — 2026-10-18

- `npm run verify:knowledge`, Vitest **205/205 PASS**, release/staging guards **7/7 PASS**, ESLint clean, Vite PWA build and 11-asset smoke (`314094/320000` bytes main JS budget), `npm run verify:security` npm audit **zero known vulnerabilities**. All are local checks, not proof of real provider-staging RLS or green remote PR CI.
- Full product Chromium **64/64 PASS**; independent About/Contact Studio contract **14/14 PASS** (light/dark × 320/390/1440 and Turkish at320), checking H1 colour contrast ≥4.5, semantic heading, no document overflow, preserved four trust/four formats, all three Contact reasons, mailto + GitHub destinations, and 44px targets. Structured Oracle imports: Vitest `ev-3d39e17e97b26395414b`, full Chromium `ev-7ce3729349552396dd2f`, static contracts `ev-3b11654c704fa230e19a`.
- Original About/Contact **four** viewport visual goldens rechecked: **0 PASS, 4 screenshot-only FAIL**, and no functional assertion failures. Playwright's runner EXIT1 is expected for unaccepted visual screenshots; the reporting wrapper's exit0 is *not* a successful CI run. Imported as failed QA `ev-34bc07666f15849a846a`, SHA `f2d8664c452fae6f78e03c354c4c50f128fcf8e7b164a4857778598d9be597df`. No golden/tolerance edits.
- True native 100%/200%/400% Xvfb Chromium zoom suite **27/27 route-geometry PASS** including About at CSS320, **8/8 sample focus-path PASS** (35 total import `ev-687f020d74a3ba288986`). This is a bounded automated check across the whole application, **not** proof Contact at native 400% has been manually screened with an assistive technology. Manual WCAG2.2AA is still open.
- Actual temporary light/dark cropped full-page screenshots (desktop on left, mobile on right) were validated as HTTPS 200 / image/jpeg and delivered in chat. These files and `/tmp/postify-static-old-visual-final.json` are only local/short-lived QA artifacts; no private user data is contained.

**Owner About/Contact design acceptance still PENDING.** Full-site visual release NO-GO continues (historical 81 old screenshot mismatches), real isolated Supabase staging auth/RLS and user-authorized production deployment also pending.
