/**
 * Fail closed if an A/B performance comparison uses different built-in knowledge
 * or release evidence. Build-generated files can be ignored by Git and omitted
 * from a fresh git-archive control tree, even though app code/CSS is identical.
 * Usage: node scripts/qa/assert-runtime-artifact-parity.mjs /tmp/control /tmp/candidate
 * Local build inspection only; no network or write operations.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

const [controlArgument, candidateArgument, ...extra] = process.argv.slice(2);
if (!controlArgument || !candidateArgument || extra.length) {
  console.error('Usage: node scripts/qa/assert-runtime-artifact-parity.mjs CONTROL_BUILD CANDIDATE_BUILD');
  process.exit(2);
}

const exempt = (relativePath) => relativePath === 'index.html'
  || relativePath === 'sw.js'
  || /^workbox-[^/]+\.js$/.test(relativePath)
  || relativePath === 'assets'
  || relativePath.startsWith(`assets${sep}`);

const inventory = (directory) => {
  const base = resolve(directory);
  if (!statSync(base).isDirectory()) throw new Error(`Not a build directory: ${base}`);
  const files = new Map();
  const visit = (path) => {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      const fullPath = join(path, entry.name);
      const name = relative(base, fullPath);
      if (exempt(name)) continue;
      if (entry.isDirectory()) visit(fullPath);
      else if (entry.isFile()) {
        const sha256 = createHash('sha256').update(readFileSync(fullPath)).digest('hex');
        files.set(name, sha256);
      } else throw new Error(`Unexpected build entry: ${name}`);
    }
  };
  visit(base);
  return files;
};

try {
  const a = inventory(controlArgument);
  const b = inventory(candidateArgument);
  const mismatches = [...new Set([...a.keys(), ...b.keys()])].sort().filter(
    (name) => !a.has(name) || !b.has(name) || a.get(name) !== b.get(name),
  );
  console.log(JSON.stringify({
    passed: mismatches.length === 0,
    checkedFiles: new Set([...a.keys(), ...b.keys()]).size,
    mismatches,
    note: 'Only generated entrypoints and hashed JavaScript/CSS build assets are exempt; all public runtime content must match.',
  }, null, 2));
  if (mismatches.length) process.exitCode = 1;
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
