import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const testReport = '/tmp/postify-release-preflight-test.json';

test('release inventory must fail closed without visual, staging and human release signoffs', () => {
  const run = spawnSync(process.execPath, [
    'scripts/qa/release-preflight.mjs', '--json', testReport,
  ], { encoding: 'utf8', timeout: 15_000 });
  assert.equal(run.status, 2, run.stderr || run.stdout);
  const report = JSON.parse(readFileSync(testReport, 'utf8'));
  assert.equal(report.status, 'NO_GO');
  assert.equal(report.live, null);
  assert.ok(report.checks.some((check) => check.name === 'ci_visual_snapshots' && check.status === 'PENDING'));
  assert.ok(report.checks.some((check) => check.name === 'owner_production_approval' && check.status === 'PENDING'));
  assert.ok(report.checks.some((check) => check.name === 'staging_oauth_rls' && check.status === 'PENDING'));
  assert.ok(!run.stdout.includes('secret'));
});

test('refuses to write preflight report outside the temporary evidence directory', () => {
  const run = spawnSync(process.execPath, [
    'scripts/qa/release-preflight.mjs', '--json', 'docs/should-not-be-written.json',
  ], { encoding: 'utf8', timeout: 15_000 });
  assert.notEqual(run.status, 0);
  assert.match(run.stderr, /under \/tmp only/);
});

test('release visual gate does not accept a passing partial screenshot subset', () => {
  const subsetPath = '/tmp/postify-release-preflight-visual-subset.json';
  writeFileSync(subsetPath, JSON.stringify({ stats: { expected: 2, unexpected: 0, skipped: 0 } }));
  const run = spawnSync(process.execPath, [
    'scripts/qa/release-preflight.mjs', '--visual-report', subsetPath, '--json', testReport,
  ], { encoding: 'utf8', timeout: 15_000 });
  assert.equal(run.status, 2, run.stderr || run.stdout);
  const report = JSON.parse(readFileSync(testReport, 'utf8'));
  assert.equal(report.checks.find((check) => check.name === 'ci_visual_snapshots').status, 'BLOCK');
});
