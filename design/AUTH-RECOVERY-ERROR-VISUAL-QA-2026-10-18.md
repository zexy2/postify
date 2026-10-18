# Postify — Authentication and error screen QA (2026-10-18)

**Scope:** isolated local QA of login, registration, password-recovery, OAuth callback, account menu, not-found and error-recovery routes. No live auth provider calls, no Supabase staging connection, no changes to production data or UI screenshot golden files.

## Historical visual CI — not accepted

A focused original-snapshot rerun selected **17** old checks: **15 Auth & errors** category cases plus **2 Admin error recovery** cases whose titles matched the search expression. Results: **0 pass / 17 screenshot-only fail**; 15 Auth & errors failures were image comparisons, not form/route assertions. This selection is not a substitute for full-site visual CI and does not prove that goldens should be accepted. The last *full* site visual gate still has **40/121 pass, 81 screenshot fails**; About/Contact remain direction-unapproved, and other groups' golden changes remain owner-review pending.

Original historic Auth & errors failures encompass account-menu desktop, login/register/forgot/reset/OAuth callback/not-found desktop light and dark, plus desktop/mobile error-recovery screenshots. They are typically **2–8% pixel differences** without screenshot dimension drift in the original baseline inventory. Do not conceal them with tolerance changes or mass `--update-snapshots`.

## Concrete functional accessibility regression found and repaired

New independent `e2e/visual/auth-recovery-release-contract.spec.js` covers **12** local cases: each of login, register, forgot-password and reset-password at 320, 390 and 1440 CSSpx (alternating light/dark), using intentionally invalid input so authentication requests are not sent. Checks: invalid form focuses first invalid input, `aria-invalid`, linked alert error description, password visibility toggle and ≥44px controls, no horizontal overflow, and visible return-to-login recovery links at ≥44px.

**Red/green proof:** Before changing product CSS the tests returned **10 pass / 2 fail**. At desktop width1440, the `/auth/forgot-password` and `/auth/reset-password` return-to-sign-in link rectangles were only **19.796875 CSSpx** high; at mobile, existing media CSS already provided ≥44px. This is a real regression in pointer/touch reachability consistency, not a screenshot-color preference.

**Narrow fix:** `src/pages/PasswordRecoveryPage/PasswordRecoveryPage.module.css` now gives `.backLink` and the successful-completion `.complete a` links `display:inline-flex;align-items:center;min-height:44px` at **every** viewport width, removing the redundant mobile-only declaration. No auth/session/OAuth APIs, request payloads, focus logic, validation, copy, screenshots or global styles changed. The unchanged new 12-case Chromium suite then passed **12/12**. This is local browser evidence, not manual WCAG2.2AA or provider-staging signoff.

## Release decision

The focused screenshot mismatches remain **OPEN** until owner reviews the affected old/new UI and explicitly accepts new exact baselines or asks for adjustments. Real external OAuth/session, Supabase isolated staging actor RLS/CRUD, full manual AT/WCAG2.2 AA and mobile field performance are **not validated**. Do not merge/push/deploy to production.

## Final test imports and snapshot rerun after fix

- **RED (before fix):** 10/12 passed, 2 desktop return-to-login touch targets failed. Oracle failed QA `ev-3412507964aa6c2abd1c`.
- **GREEN (after fix):** 12/12 passed, no flaky or skipped. Oracle success `ev-b211e8142af75f0b1998`.
- **Full product QA after fix:** 205/205 Vitest (`ev-fffe532b78ba14954e1c`); 64/64 Chromium product E2E (`ev-02bec0a27e74030fb065`); 7/7 release/staging guards, ESLint, production PWA build/smoke11 (main entry 314094/320000 bytes), npm audit0 known vulnerabilities **PASS**. These are local checks, not independent proof of real OAuth provider exchange or Supabase RLS.
- **Existing historic visual inventory:** 17 screenshots selected (15 Auth/errors + 2 Admin error-recovery) **0/17 pass**, all screenshot-only (`ev-76ffa57187a43dafce0b`), run *before* recovery touch fix. The four light/dark forgot/reset originals were also **rechecked after the fix: 0/4 pass, all four screenshot-only** (`ev-5564710319bf730b380e`). Historic goldens preserved; no mass updates.
- Full raw audit reports were copied to `/tmp/postify-auth-recovery-release-evidence-20261018/` before removing generated QA output. Manual assistive-technology checks, exact old/new visual acceptance and nonproduction identity/RLS remain open.
