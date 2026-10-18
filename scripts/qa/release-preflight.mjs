/**
 * Postify RELEASE INVENTORY — read-only, fail-closed, never deploys or pushes.
 * Node 24: node scripts/qa/release-preflight.mjs [--production]
 *       [--visual-report /tmp/playwright.json] [--ui-report /tmp/playwright.json]
 *       [--vitest-report /tmp/vitest.xml] [--json /tmp/postify-release-preflight.json]
 * Generated report is not release authorization. Human approvals remain required.
 */
import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const options = {};
for (let i = 2; i < process.argv.length; i += 1) {
  const argument = process.argv[i];
  if (argument === '--production') { options.production = true; continue; }
  if (!['--visual-report', '--ui-report', '--vitest-report', '--json'].includes(argument) || !process.argv[i + 1]) {
    throw new Error(`Unknown/missing option ${argument}`);
  }
  options[argument.slice(2)] = process.argv[++i];
}

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const passed = (name, detail) => ({ name, status: 'PASS', detail });
const blocked = (name, detail) => ({ name, status: 'BLOCK', detail });
const pending = (name, detail) => ({ name, status: 'PENDING', detail });
const checks = [];
const head = git('rev-parse', 'HEAD');
const main = git('rev-parse', 'main');
const branch = git('branch', '--show-current');
const ahead = Number(git('rev-list', '--count', 'main..HEAD'));
const behind = Number(git('rev-list', '--count', 'HEAD..main'));
checks.push(git('status', '--porcelain') === ''
  ? passed('isolated_git_clean', `Clean branch ${branch}, HEAD ${head.slice(0, 7)}`)
  : blocked('isolated_git_clean', 'Source has pending working-tree changes; commit and retest exact sources'));
checks.push(branch !== 'main' ? passed('no_direct_main_changes', 'Release source is isolated from main')
  : blocked('no_direct_main_changes', 'Working on main; do not initiate a publish without approval'));
checks.push(ahead > 0 ? pending('release_branch_integration', `${ahead} unmerged commits; ${behind} main-only commits; merge/PR needs release approval`)
  : passed('release_branch_integration', 'No unmerged branch commits'));

const workflow = await readFile('.github/workflows/ci.yml', 'utf8');
checks.push(workflow.includes('refs/heads/main') && workflow.includes('peaceiris/actions-gh-pages')
  ? pending('main_triggers_publish', 'CI GitHub Pages deploy on main; merging after approval starts production publication automatically')
  : blocked('main_triggers_publish', 'Expected GitHub Pages main deployment workflow was not found; verify deploy routing'));
checks.push(workflow.includes('test:e2e:visual') && workflow.includes('schema-verify') && workflow.includes('production-browser-smoke')
  ? passed('ci_release_dependencies_declared', 'Visual snapshots, fresh PostgreSQL schema/RLS and production browser smoke configured')
  : blocked('ci_release_dependencies_declared', 'One or more expected CI gates are missing'));

async function parsePlaywright(name, file, minimumTotal) {
  if (!file) return pending(name, 'No explicit report supplied; do not infer current source CI result');
  const report = JSON.parse(await readFile(file, 'utf8'));
  const stats = report.stats;
  if (!stats || !Number.isInteger(stats.expected) || !Number.isInteger(stats.unexpected)) {
    return blocked(name, 'Playwright report missing expected/unexpected counts');
  }
  const total = stats.expected + stats.unexpected + (stats.skipped ?? 0);
  const detail = `${stats.expected} expected, ${stats.unexpected} unexpected, ${stats.skipped ?? '?'} skipped, ${total} total (minimum ${minimumTotal}; local lab report; source identity not proven by import)`;
  return stats.unexpected === 0 && total >= minimumTotal && stats.skipped === 0
    ? passed(name, detail) : blocked(name, detail);
}

checks.push(await parsePlaywright('chromium_ui', options['ui-report'], 60));
checks.push(await parsePlaywright('ci_visual_snapshots', options['visual-report'], 100));
if (options['vitest-report']) {
  const xml = await readFile(options['vitest-report'], 'utf8');
  const number = (attribute) => Number(new RegExp(`\\b${attribute}="(\\d+)"`).exec(xml)?.[1] ?? NaN);
  const total = number('tests'), failures = number('failures'), errors = number('errors');
  checks.push(Number.isFinite(total) && total >= 205 && failures === 0 && errors === 0
    ? passed('vitest', `${total} tests, zero failures/errors (local XML report; source identity not proven by import)`)
    : blocked('vitest', `JUnit ${total} tests, ${failures} failures, ${errors} errors`));
} else checks.push(pending('vitest', 'No explicit JUnit report supplied'));

const origin = 'https://postify.zekiakgul.dev';
let live = null;
if (options.production) {
  const readJson = async (route) => {
    const res = await fetch(`${origin}/${route}?preflight=${Date.now()}`, { signal: AbortSignal.timeout(8_000), cache: 'no-store' });
    if (!res.ok) throw new Error(`${route} HTTP ${res.status}`);
    return res.json();
  };
  try {
    const [release, backend] = await Promise.all([readJson('release.json'), readJson('knowledge-backend-status.json')]);
    live = { sourceSha: release.sourceSha ?? null, builtAt: release.builtAt ?? null, backendReady: backend.ready === true, backendMode: backend.mode ?? null };
    checks.push(release.sourceSha === head
      ? passed('live_release_identity', 'Live release SHA already matches local source')
      : pending('live_release_identity', `Live ${String(release.sourceSha).slice(0, 7)}, local ${head.slice(0, 7)}; new version NOT yet published`));
    checks.push(backend.ready === true ? passed('live_backend_capability_artifact', 'Live public capability artifact reports ready')
      : pending('live_backend_capability_artifact', `Live public capability reports ready:false (${backend.mode || 'unknown'}); stage/authenticate backend checks before cutover`));
  } catch (error) {
    checks.push(blocked('live_release_probe', `Read-only production status request unavailable: ${String(error.message).slice(0, 130)}`));
  }
} else checks.push(pending('live_release_probe', 'Use --production for optional read-only public release/artifact comparison'));

// These are *approval/evidence* gates, not flags inferred from a passing mocked test.
checks.push(pending('github_ci_required_runs', 'Exact-head PR CI, schema/RLS PostgreSQL gate, security audit and visual suite need verified green CI runs'));
checks.push(pending('staging_oauth_rls', 'Nonproduction Supabase 2-account OAuth/signout/token refresh/RLS and protected CRUD evidence required'));
checks.push(pending('visual_design_acceptance', 'Review baseline drift and approve exact desktop/mobile light/dark images; do not rewrite golden snapshots automatically'));
checks.push(pending('wcag_manual', 'Manual VoiceOver/NVDA and full protected routes WCAG 2.2 AA keyboard/focus review required'));
checks.push(pending('mobile_performance', 'Accept explicit mobile performance target; field p75 Core Web Vitals not available'));
checks.push(pending('owner_production_approval', 'Explicit permission for merge that triggers production deploy, rollback plan and deployment window required'));

const status = checks.every((check) => check.status === 'PASS') ? 'GO_CANDIDATE' : 'NO_GO';
const result = { schemaVersion: 1, status, generatedAt: new Date().toISOString(), source: { head, main, branch, ahead, behind }, live, checks };
const output = options.json || '/tmp/postify-release-preflight.json';
if (!path.resolve(output).startsWith('/tmp/')) throw new Error('Preflight report must be written under /tmp only');
await writeFile(output, `${JSON.stringify(result, null, 2)}\n`);
console.log(`POSTIFY_RELEASE_PREFLIGHT ${status} | PASS=${checks.filter((c) => c.status === 'PASS').length}, BLOCK=${checks.filter((c) => c.status === 'BLOCK').length}, PENDING=${checks.filter((c) => c.status === 'PENDING').length}`);
for (const { name, status: state, detail } of checks) console.log(`${state.padEnd(7)} ${name}: ${detail}`);
console.log(`READ_ONLY_REPORT ${output}`);
// NO_GO uses exit 2 so it cannot be mistaken for deployment authorization.
if (status !== 'GO_CANDIDATE') process.exitCode = 2;
