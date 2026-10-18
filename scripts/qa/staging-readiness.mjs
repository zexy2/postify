/**
 * Isolated Supabase staging *read-only* preflight.
 * Does not sign users in, request OAuth tokens, list private data, or write to DB.
 * No secrets are printed. A missing staging project is an explicit BLOCK, never PASS.
 * With configured stage-only env vars, optionally probe the public capability endpoint.
 *
 * STAGING_SUPABASE_URL=... STAGING_SUPABASE_ANON_KEY=... \
 *   node scripts/qa/staging-readiness.mjs [--probe-public-readonly]
 */
import { readFileSync } from 'node:fs';

const flag = process.argv.slice(2);
if (flag.some((item) => item !== '--probe-public-readonly')) {
  throw new Error('Unknown argument; only --probe-public-readonly is supported');
}
const productionWorkflow = readFileSync('.github/workflows/supabase-production-migrate.yml', 'utf8');
const productionRef = /SUPABASE_PROJECT_REF:\s*["']?([a-z0-9]{20})/.exec(productionWorkflow)?.[1];
if (!productionRef) throw new Error('Production project reference cannot be read; fail closed');
const stageUrl = process.env.STAGING_SUPABASE_URL?.trim();
const stageKey = process.env.STAGING_SUPABASE_ANON_KEY?.trim();
if (!stageUrl || !stageKey) {
  console.log('STAGING BLOCK: isolated STAGING_SUPABASE_URL and STAGING_SUPABASE_ANON_KEY are not configured; production is forbidden.');
  process.exit(2);
}
let url;
try { url = new URL(stageUrl); } catch { console.error('STAGING BLOCK: invalid stage URL'); process.exit(2); }
const host = /^([a-z0-9]{20})\.supabase\.co$/.exec(url.hostname);
if (!host || url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || (url.pathname !== '/' && url.pathname !== '')) {
  console.error('STAGING BLOCK: requires a canonical HTTPS Supabase project origin, without embedded credentials or query');
  process.exit(2);
}
if (host[1] === productionRef) {
  console.error('STAGING BLOCK: requested project matches PRODUCTION. No network request was sent.');
  process.exit(2);
}
if (flag.length === 0) {
  console.log(`STAGING CONFIG ONLY: separate project ref ${host[1].slice(0, 4)}… is configured. No network test or RLS authorization performed.`);
  process.exit(2); // configured ≠ staging verified
}
const endpoint = new URL('/rest/v1/knowledge_backend_capabilities?select=schema_version,evidence_ready,corrections_ready&limit=1', url.origin);
let response;
try {
  response = await fetch(endpoint, {
    method: 'GET',
    headers: { apikey: stageKey, Authorization: `Bearer ${stageKey}`, Accept: 'application/json' },
    signal: AbortSignal.timeout(7_000),
    redirect: 'error',
  });
} catch {
  console.error('STAGING BLOCK: public read-only capability endpoint could not be reached; no private/user operations attempted.');
  process.exit(2);
}
if (!response.ok) {
  console.error(`STAGING BLOCK: public capability HTTP ${response.status}; no user login or RLS test performed.`);
  process.exit(2);
}
let parsed;
try { parsed = await response.json(); } catch { console.error('STAGING BLOCK: capability response is not JSON'); process.exit(2); }
const row = Array.isArray(parsed) ? parsed[0] : null;
if (Number(row?.schema_version) < 2 || row?.evidence_ready !== true || row?.corrections_ready !== true) {
  console.error('STAGING BLOCK: public capability schema/evidence/correction contract is incomplete.');
  process.exit(2);
}
console.log('STAGING PUBLIC CONTRACT PASS: read-only capability schema v2+, evidence/corrections enabled.');
console.log('STAGING AUTH/RLS STILL PENDING: 2-account OAuth, CRUD, protected storage and role tests need isolated synthetic accounts.');
process.exitCode = 2; // Never certify complete RLS from public reads alone.
