# Postify — About / Contact direct URL HTTP 200 release

## Why (owner-directed)

After the first two public release slices, owner explicitly approved fixing and publishing the remaining deep-link issue. On 2026-10-19, live https://postify.zekiakgul.dev/about and /contact returned HTTP 404 with a SPA redirect shell; JavaScript eventually repaired the browser view, but the first HTTP response remained wrong.

## Minimal public-only implementation

- Based on exact live Home main SHA 079565aedba171e47b832e1555eb2f8d25591e09 in the independent postify-direct-url-20261019 worktree.
- During npm run build, create docs/about/index.html and docs/contact/index.html from Vite's freshly compiled docs/index.html. Generated shells retain the **same hashed JS entry and React root**, but receive page-specific static title, description and canonical URL.
- GitHub Pages serves /about/ and /contact/ as actual HTML documents; extensionless /about and /contact normalize to these directories. Existing public SPA 404 fallback remains unchanged for all unknown, protected and dynamic routes.
- No React route/auth/CSS/color/header changes, no added privileges, Supabase migrations, backend readiness override, global rewrites or cache tricks.
- Standalone unit contracts test exact two-route whitelist, asset parity, unique canonical metadata and fail-closed negative cases. Build smoke checks 13 critical artifacts, including both built shells and original 320000-byte entry budget.
- Official production CI browser smoke now fetches the public direct paths and requires **HTTP 200**, correct HTML content-type, exact route title and canonical metadata.

## Gates and rollback

- Node24 clean install, full verify, security, real HTTP direct checks, full compiled product Chromium and exact remote CI must pass. Do not assert local Python static-server success proves behavior on GitHub Pages.
- Publish only by fully green scoped PR protected squash merge, verify release.json exact source SHA, direct public URLs, real content and backend ready:false.
- Previous Home public main SHA 079565a is the rollback base. Hosted synthetic staging OAuth/Storage RLS, native assistive-technology WCAG 2.2 AA and field p75 Core Web Vitals remain unverified and protected writes remain gated.

## Test chronology

- New unit contracts **2/2 PASS**.
- Node24 full verification **163/163 Vitest** and lint/build/13-critical-artifact smoke, entry JavaScript **319710 of 320000 bytes** PASS; security audit zero, job job-69d49c426edc exit 0.
- Real static Python HTTP server of generated output: /about and /contact direct URLs both **HTTP200** at 390px and 1440px = **4/4**, route metadata and React headings correct, zero JS errors or horizontal overflow; initial extensionless address redirects to trailing slash.
- Attempt to run entire product E2E against a plain Python static server was cancelled: it lacks the existing GitHub Pages fallback needed by unrelated dynamic routes; not a product regression and not a full-suite PASS. Job job-2ed6cb092444 cancelled after independent direct 4/4 evidence. Exact product E2E with Vite preview pending.
- PR remote CI and live publication not yet confirmed at this checkpoint.

## Product browser result

- Exact newly compiled output served with Vite preview (which supports unrelated client-side SPA routes): **52/52 Chromium product E2E PASS, zero flaky/skipped**, job job-198bc3b17b42, report /tmp/postify-direct-url-product-20261019.json. This is separate from the bare Python static server's scoped 4/4 direct-URL checks.
- Full unit/security verification PASS, scoped direct static HTTP200 PASS. Awaiting exact GitHub PR test status; publish remains pending.
