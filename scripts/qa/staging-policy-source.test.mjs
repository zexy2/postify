import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const migration = (filename) => readFileSync(new URL(`../../supabase/migrations/${filename}`, import.meta.url), 'utf8');

test('authenticated clients cannot directly insert or update profile role', () => {
  const sql = migration('20261019190000_lock_profile_role_client_writes.sql');
  assert.match(sql, /revoke insert, update on public\.profiles from anon, authenticated;/i);
  assert.doesNotMatch(sql, /grant\s+update\s*\([^)]*\brole\b/i);
  assert.doesNotMatch(sql, /grant\s+insert\s*\([^)]*\brole\b/i);
});

test('anonymous correction RPC access is revoked, capability view is invoker', () => {
  const sql = migration('20261019190500_harden_capability_view_and_correction_rpc_acl.sql');
  assert.match(sql, /alter view public\.knowledge_backend_capabilities set \(security_invoker = true\)/i);
  assert.match(sql, /revoke execute on function public\.withdraw_correction_suggestion\(uuid\) from anon;/i);
  assert.match(sql, /revoke execute on function public\.resolve_correction_suggestion\(uuid,text,text\) from anon;/i);
});

test('public author reads omit email and anon profile email reads are revoked', () => {
  const sql = migration('20261019191000_restrict_anonymous_profile_email.sql');
  assert.match(sql, /revoke select on public\.profiles from anon;/i);
  assert.doesNotMatch(sql, /grant select\s*\([^)]*\bemail\b/i);
  const service = readFileSync(new URL('../../src/services/postService.js', import.meta.url), 'utf8');
  assert.match(service, /\.select\('id, full_name, username, avatar_url, bio, role'\)/);
});
