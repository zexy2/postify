import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const run = (env) => spawnSync(process.execPath, ['scripts/qa/staging-readiness.mjs', '--probe-public-readonly'], {
  encoding: 'utf8', timeout: 10000,
  env: { PATH: process.env.PATH, ...env },
});

test('missing staging configuration refuses any backend test', () => {
  const result = run({});
  assert.equal(result.status, 2);
  assert.match(result.stdout, /STAGING BLOCK/);
});

test('production Supabase project URL is rejected before network access', () => {
  const prod = 'https://fuiwcrqmxndguxymwoin.supabase.co';
  const result = run({ STAGING_SUPABASE_URL: prod, STAGING_SUPABASE_ANON_KEY: 'synthetic-sentinel-key' });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /matches PRODUCTION/);
  assert.doesNotMatch(result.stdout + result.stderr, /synthetic-sentinel-key/);
});

test('non-Supabase host is rejected even with a fake key', () => {
  const result = run({ STAGING_SUPABASE_URL: 'https://example.com', STAGING_SUPABASE_ANON_KEY: 'fake-only' });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /canonical HTTPS Supabase/);
});

test('separate Supabase project can only pass configuration, not real RLS without access', () => {
  const result = spawnSync(process.execPath, ['scripts/qa/staging-readiness.mjs'], {
    encoding: 'utf8', timeout: 10000,
    env: { PATH: process.env.PATH, STAGING_SUPABASE_URL: 'https://abcdefghijklmnopqrst.supabase.co', STAGING_SUPABASE_ANON_KEY: 'synthetic-key' },
  });
  assert.equal(result.status, 2);
  assert.match(result.stdout, /CONFIG ONLY/);
  assert.doesNotMatch(result.stdout + result.stderr, /synthetic-key/);
});
