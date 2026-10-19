# Postify — independent staging Supabase auth/RLS acceptance

**Current status 2026-10-18: BLOCKED — no identifiable isolated staging project in the Oracle run. No authenticated backend test has been run.** This document is an executable acceptance plan, not evidence of a passing remote test.

## Setup and safety

1. The owner creates/selects a **separate Supabase project**, with a distinct Supabase project reference from the production ref configured in `.github/workflows/supabase-production-migrate.yml`. No clone of real user data or production auth tokens. Cost, provider account and provisioning require owner approval. This run found only GitHub environments `production` and `github-pages`; absence of a `staging` GitHub environment does not prove that no separate Supabase project exists elsewhere.
2. Use owner-controlled Supabase dashboard or a connected integration to configure a test-only app origin, Auth redirect allow-list and test provider callbacks. Deploy or locally run the frontend against **only staging**. Configure `STAGING_SUPABASE_URL` and `STAGING_SUPABASE_ANON_KEY` in an isolated credential store/CI environment, **never in tracked `.env` files or chat**. The public `anon`/publishable key may be exposed to a browser, but **service-role/database passwords must never be bundled into client JavaScript**.
3. Source code includes `scripts/qa/staging-readiness.mjs`, which checks the project reference against production and fails before any remote request if they match. By default it validates only configuration and exits code 2 (not a staging PASS). The opt-in `--probe-public-readonly` performs one anonymous **GET** of public schema capabilities and still exits 2 because public access does **not** verify protected authorization. Its tests explicitly check missing config, forged external host, production ref and nonprod config-only as fail closed.
4. Use **synthetic** test identities A (reader), B (author/editor) and C (admin), with fresh test content labelled for this run. Never run destructive migrations or account deletion on production. Database migration dry-run, storage policy inspection and synthetic setup require separately authorized owner access and confirmed staging ref.

## Evidence matrix to complete once staging is connected

| Capability | Minimum required real evidence | Go/no-go threshold |
| --- | --- | --- |
| Password sign-in and sign-out | A can sign in, sign out, and stale authenticated UI/action handlers cannot mutate A data after logout | 0 stale-account leaks |
| OAuth and callback | Test provider round trip on stage-only redirect URL, account identity verified after return | Correct identity; no cross-project redirects |
| Token/session refresh | Reopen/refresh and rotate session, session identity remains stable; expired/revoked session fails closed | Authorization checked server side |
| Account switch A→B | Guest/A/B local bookmark shelves and old unowned records remain separate; import requires explicit owner checkbox | No silent legacy claims or cross-account view |
| Profiles and avatars | A writes its own profile/avatar to staging; B cannot update/read private A storage; logged-out cannot access protected objects | RLS deny for wrong identity |
| Post drafts, publish, edit | Editor B creates/updates only authorized posts; A cannot alter B posts; public sees only published posts | Server authorization, not disabled button |
| Admin users and moderation | C may change allowed roles/moderation with explicit confirmation; A/B cannot call admin APIs by crafting requests | Unauthorized attempts rejected |
| Knowledge evidence + RPC | Author-owned failure details protected, public sanitized aggregate available; invalid contributor self-confirmation rejected | Actual RLS/policy and verified RPC responses |
| Capability/data freshness | `knowledge_backend_capabilities` and deployed `knowledge-backend-status.json` agree with actual staging tables, no fabricated `verified` badge | Capability true only after real proof |
| Regression and restore | Main Chromium 60/60, unit 205+, complete visual suite, 400% keyboard and mobile first-menu budget, with stage configured | All mandatory gates green before production |

For each action, preserve only redacted HTTP status, authenticated role, path/operation, timing and report hash; never save passwords, bearer tokens, personal user data or service keys. An anonymous read-only query is not proof that RLS blocks A→B writes. Fake/mock fixture success is explicitly **not staging signoff**.

## Owner signoff required before production

Staging project separately identified and approved; minimum A/B/C identity + RLS checks with real stage tokens completed, all failed negative authorization probes recorded, cleanup limited to synthetic staging rows, exact-source CI green, screenshot owner acceptance, manual screen-reader/WCAG2.2 AA and mobile performance acceptance. Only then request **separate owner approval** to merge to `main` (which automatically starts the GitHub Pages production deployment). Production schema migrations remain separately approved; never infer they are needed from a possibly stale public status artifact.

## 2026-10-19 — Free isolated staging provisioning and security baseline

- Owner approved $0-only use. Created **postify-staging** (`eu-central-1`, ref `xsljmvhjbchhnoyacnzx`, ACTIVE_HEALTHY) in the existing free organization; compared its ref against the production workflow and verified it is distinct. No production database, GitHub or Pages operation performed.
- Applied the 12 ordered historical Postify SQL files plus a profile role-privilege lock to the empty staging DB as one atomic Supabase migration. A later migration hardened the capabilities view and removed direct `anon` EXECUTE for correction-state SECURITY DEFINER RPCs. Third staging migration revokes anonymous profile-table SELECT and grants only non-email public display columns. **Note migration history drift:** Supabase recorded three timestamp-generated migration versions grouping repository SQL; never blindly `db push` the same historical files to this project without a planned history reconciliation.
- Verified via stage SQL: **11/11 public tables have RLS enabled** (32 policies), two configured image buckets, `anon` cannot SELECT `profiles.email`, `authenticated` cannot INSERT/UPDATE `profiles.role`, ordinary name edits retain column privileges, anonymous correction RPC EXECUTE is false, and `knowledge_backend_capabilities` is `security_invoker=true`. Emulated `authenticated` role in a rollback transaction: one published demo post readable, private correction suggestions invisible, role update privilege false. **These are permission checks and simulated database role tests, not real authenticated end-to-end OAuth/RLS signoff.**
- Security advisor has two residual WARN findings on authenticated `SECURITY DEFINER` correction RPCs; intended server-checked actor flow, pending real negative actor tests and final review. See https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable.
- **Release blockers:** authenticated users still have read permission for other profiles' emails under the historical `profiles are public` SELECT policy; must redesign protected own/admin contact disclosure before onboarding real accounts. The existing browser `adminService.updateUserRole` directly writes the `role` column and will now be denied; roles must use a separately designed trusted server-only path. Real stage-only A/B/C synthetic OAuth/password, refresh, CRUD, avatar/storage RLS, native screen-reader WCAG 2.2 AA, 81 visual owner decisions and mobile field p75 CWV remain OPEN. Public production `ready:false` remains unchanged.
