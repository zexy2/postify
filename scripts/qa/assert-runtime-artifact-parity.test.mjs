import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const script = new URL('./assert-runtime-artifact-parity.mjs', import.meta.url);
const run = (a, b) => spawnSync(process.execPath, [script.pathname, a, b], { encoding: 'utf8' });
const fixture = (fn) => {
  const root = mkdtempSync(join(tmpdir(), 'postify-static-parity-'));
  const a = join(root, 'control');
  const b = join(root, 'candidate');
  mkdirSync(a);
  mkdirSync(b);
  try { return fn(a, b); } finally { rmSync(root, { recursive: true, force: true }); }
};

const make = (base, name, text) => {
  const parts = name.split('/');
  if (parts.length > 1) mkdirSync(join(base, ...parts.slice(0, -1)), { recursive: true });
  writeFileSync(join(base, name), text);
};

test('identical public content passes despite different generated entrypoints and code chunks', () => fixture((a, b) => {
  for (const dir of [a, b]) {
    make(dir, 'runtime-release-status.json', '{"ready":false}');
    make(dir, 'knowledge/post-1.en.json', '{"title":"one"}');
    make(dir, 'assets/index-different.js', 'some compiled code');
  }
  make(a, 'index.html', '<script src="a.js"></script>');
  make(b, 'index.html', '<script src="b.js"></script>');
  make(a, 'sw.js', 'self.__WB_MANIFEST=[]');
  make(b, 'sw.js', 'self.__WB_MANIFEST=[1]');
  const result = run(a, b);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).passed, true);
}));

test('missing ignored release-evidence and nested knowledge files fail before benchmarks', () => fixture((a, b) => {
  make(b, 'runtime-release-status.json', '{"ready":false}');
  make(b, 'verification-runs.json', '{"status":"verified"}');
  make(b, 'knowledge/post-1.en.json', '{"title":"one"}');
  const result = run(a, b);
  assert.equal(result.status, 1);
  assert.deepEqual(JSON.parse(result.stdout).mismatches, [
    'knowledge/post-1.en.json', 'runtime-release-status.json', 'verification-runs.json',
  ]);
}));

test('changed runtime claim rejects even when files exist on both sides', () => fixture((a, b) => {
  make(a, 'runtime-release-status.json', '{"status":"current"}');
  make(b, 'runtime-release-status.json', '{"status":"recheck-required"}');
  const result = run(a, b);
  assert.equal(result.status, 1);
  assert.deepEqual(JSON.parse(result.stdout).mismatches, ['runtime-release-status.json']);
}));

test('invalid invocation and missing directories are rejected', () => fixture((a, b) => {
  const noArgs = spawnSync(process.execPath, [script.pathname], { encoding: 'utf8' });
  assert.equal(noArgs.status, 2);
  assert.equal(run(a, join(b, 'missing')).status, 2);
}));
