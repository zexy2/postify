# Postify — About/Contact PL-01 palette restoration (2026-10-19)

## Trigger and design authority

User explicitly challenged the purple/violet About and Contact changes, citing the previously approved palette: “mor renkler ne alaka biz renk secimini yapmistik zaten oncesinden mor yoktu”. **CD-003 PL-01 Oxide & Newsprint** was already selected and approved on 17 October. The violet interpretation of “more modern” in exploratory CD-014 was a mistake. CD-016 supersedes that attempted art direction. Older AI-generated violet concepts and code screenshots from commit 6054461 are **historical/rejected options**, not current accepted previews.

## Current implementation — strictly two pages and their CSS

- **Preserve** the developed modern editorial composition: asymmetric hero, stronger typography, About index/trust model/four formats, Contact communication channels/correction help; no invented working form.
- **Restore approved colors** via PL-01/global theme tokens on AboutPage.module.css and ContactPage.module.css. Light outer reading canvas paper #F4EFE6, primary ink #1F2420, oxide accent #A13826. Dark canvas #151B19, raised surface #222A26, warm ink #EFEDE5, coral accent #F2AC91. The deliberately dark editorial hero retains approved *dark* PL-01 colors across themes (same dark-cover exception as CD-012 Home).
- Real mailto, GitHub and in-product CTA links remain unchanged; no app-wide token modifications, Supabase changes, actual user content edits or changes to component behavior. No violet or purple custom hex, RGBA/radial hues or palette tokens remain in the two CSS modules.
- Modern-ink contract assertions corrected to require PL-01 paper/dark computed page background, PL-01 rust hero radial color and the actual warm-paper heading text. Prior static-studio check waits for the route stylesheet to load before asserting custom Inter font: one intermittent fallback-Fraunces hit was confirmed as a timing issue by a clean focused rerun.

## QA evidence for recolored candidate

- Node24 Vitest **205/205 PASS**, ESLint PASS, Node24 production Vite build PASS and exact build smoke **11 critical files**, entry JS **314094 / 320000 bytes**, job job-6f586a4ec784.
- Current visual/non-screenshot responsive contracts **32/32 PASS**, light/dark × 320/390/768/1440 + localized mobile, actual HTML landmarks and target links, job job-809e572be57d. Earlier first run before waiting for font readiness had 31/32 + one early font fallback mismatch; later repeated green run is the current evidence.
- Exact current-source production build product Chromium suite **68/68 PASS** (job job-2d9d68032749, exit 0). Eight real screenshots at About/Contact × light/dark × width390/1440 saved under /tmp/postify-pl01-actual-20261019/, with zero JS page errors, no horizontal overflow; sampled outer canvas is rgb(244,239,230) light and rgb(21,27,25) dark, masthead text rgb(239,237,229) and oxide radial rgba(161,56,38). Screenshots are generated but **not** yet owner-approved or published as a new preview.

## Nonauthorization

No push, live preview, main merge, snapshot/golden replacement or production deployment was done or authorized. The overall 81 historical screenshot-diff review, real isolated Supabase staging actors/RLS/OAuth, manual WCAG2.2 AA and field mobile CWV are still required. Production remains **NO-GO**.
