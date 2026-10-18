# Postify release readiness — independent SQL/RLS and mobile Lighthouse lab

Date: 18 October 2026. Oracle task: `run-96210d9920c1`. Tested source: isolated worktree `chatgpt/ws-276e5f67e3ed` at Git commit `6993777daa1d4036624b57b3d6a93bda7c079e3c`. No remote push, main merge, production deployment, staging database mutation or visual snapshot update.

## PostgreSQL 16 schema/RLS reproduction

- Docker used the **exact image pinned in `.github/workflows/ci.yml`**: `postgres:16-alpine@sha256:cf78e76683b9ca8c5733cbbdce6c9262b45b6767934dd0a95e671f9a0fc20685`, reporting server **16.15**.
- Launched a dedicated temporary Docker container on Docker network `none` with **no published ports**, mounted only this worktree's `supabase/` directory **read-only**, and populated synthetic bootstrap `auth`/`storage` roles/functions from the CI job. No real user identities, secrets or production data.
- Applied **12/12 migrations** in their filename order, each under `psql -v ON_ERROR_STOP=1`. Ran the exact `supabase/verify-verified-knowledge.sql` afterward: **exit 0**, with explicit `correction suggestions RLS PASS` and `knowledge backend capability v2 PASS`. The verification SQL also includes denials for inappropriate reader failure-detail access, cross-user confirmations/shelves, fake verified claims and exposed privileged RPCs.
- Container was removed by a shell `EXIT` trap. Oracle recorded source job **`job-8c0b13e18873`** with exit 0; logs retained under `/tmp/postify-rls-{bootstrap,migrations,verification}-6993777.log` and job log. No tracked Git changes from this test.
- **Limit:** This reproduces local SQL/schema/role enforcement using the CI image; it is **not evidence of Supabase-hosted staging A/B/C OAuth flows, real token validation, actual Storage API or production RLS deployment**. `STAGING_SUPABASE_URL` and `STAGING_SUPABASE_ANON_KEY` were absent at the start of this QA run.

## Mobile performance: exactly the current source build

- Built Git source `6993777` using Vite 7 on the preinstalled Node **24.21.0** into a dedicated `/tmp` directory, previewed on localhost, captured **three Lighthouse 13.5.0** mobile performance-only runs with simulated throttling, headless Chromium and no production credentials. The temporary build and preview server were removed.
- Individual readings:

| Trial | Performance | FCP (ms) | LCP (ms) | TBT (ms) | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 59 | 3,878 | 4,759 | 592 | 0 |
| 2 | 59 | 3,936 | 4,788 | 566 | 0 |
| 3 | 56 | 4,042 | 4,976 | 646 | 0 |
| **Median** | **59** | **3,936** | **4,788** | **592** | **0** |

- Raw reports retained at `/tmp/postify-6993777-lh-mobile-{1,2,3}.json`, Oracle job **`job-133f7908f01c`** exit 0. The LCP is a featured-card image (its request is already eager/high priority/discoverable); Lighthouse identifies initial main-thread **style/layout ~1,485 ms**, script evaluation ~705 ms, and estimated **93 KiB** unused JavaScript. At least **40,688 bytes** wasted belong to the Supabase initial vendor asset in the first run. This diagnostic is not a proven safe code-change opportunity by itself.
- Results are consistent with the historical mobile lab around 59/100, LCP ~4.7s, TBT ~600ms. **No meaningful measured improvement or release performance acceptance** is claimed. Field p75 LCP/INP/CLS are not available; mobile menu cold-click tests (424/389/437ms, all under 900ms) are a *different* interaction gate and cannot replace startup performance review.

## Release decision and next safe action

**Production NO-GO.** Latest source was not deployed and the known 81 full-site historical screenshot reference mismatches were not approved or regenerated. About/Contact visual directions remain unapproved. Isolated staging Supabase auth/actor RLS/CRUD, manual screen-reader WCAG 2.2 AA, agreed mobile performance budget, exact-release GitHub PR CI and separate production merge/publish approval remain mandatory. Any performance optimization should use alternating fresh baseline/candidate builds and include first mobile menu, scroll restoration, auth/RLS invariants and real accessibility regression checks, not only a better FCP on one run.
