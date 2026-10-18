/**
 * Linux/X11 manual release QA: real Chromium browser zoom, not CSS font scaling.
 * Usage: NATIVE_ZOOM_BASE_URL=http://127.0.0.1:4414 xvfb-run -a node scripts/qa/native-browser-zoom.mjs
 * Requires system Chromium + xdotool, and a running local Vite preview/dev server.
 * Always use a dedicated Xvfb display: OS-level keystrokes target its Chromium window.
 * Does not change user browser profiles, Supabase data, deployments, or source baselines.
 */
import { chromium } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const baseURL = process.env.NATIVE_ZOOM_BASE_URL || 'http://127.0.0.1:4414';
const origin = new URL(baseURL);
if (!['localhost', '127.0.0.1'].includes(origin.hostname) || process.platform !== 'linux' ||
    !process.env.DISPLAY || process.env.DISPLAY.startsWith(':0') ||
    process.env.NATIVE_ZOOM_ISOLATED_XVFB !== '1') {
  throw new Error('Native zoom QA requires localhost and explicitly authorized dedicated Xvfb display (NATIVE_ZOOM_ISOLATED_XVFB=1)');
}
const browserPath = process.env.NATIVE_ZOOM_CHROME || '/usr/bin/chromium-browser';
const reportPath = process.env.NATIVE_ZOOM_REPORT || '/tmp/postify-native-browser-zoom.json';
const routes = [
  ['home', '/'], ['article', '/posts/node-json-dogrulama'],
  ['auth', '/auth/login'], ['about', '/about'], ['not-found', '/nonexistent-route-qa'],
  ['bookmarks-empty', '/e2e/visual/bookmarks-empty.html'],
  ['bookmarks-populated', '/e2e/visual/bookmarks-auth.html'],
  ['bookmarks-legacy', '/e2e/visual/bookmarks-legacy.html'],
  ['profile', '/e2e/visual/profile-auth.html'],
];

const browser = await chromium.launch({
  executablePath: browserPath, headless: false,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,900'],
});
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, locale: 'en-US' });
const page = await context.newPage();
const results = [];
const focusRuns = [];
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

const sample = async () => page.evaluate(() => {
  const root = document.documentElement;
  return {
    zoom: window.devicePixelRatio,
    cssWidth: window.innerWidth,
    clientWidth: root.clientWidth,
    scrollWidth: root.scrollWidth,
    mainCount: document.querySelectorAll('main').length,
    h1Count: document.querySelectorAll('h1').length,
  };
});
const pressNativeZoom = async (steps) => {
  for (let i = 0; i < steps; i += 1) {
    // This X11 event goes through Chromium's browser window accelerator.
    // Unlike page.keyboard.press, the native zoom actually changes DPR/CSS viewport.
    execFileSync('xdotool', ['key', '--clearmodifiers', 'ctrl+plus']);
    await page.waitForTimeout(95);
  }
};
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

// Tab through *visible real controls* after browser native zoom settles.
// Allow CSS focus transitions to finish (skip link takes 160ms); do not
// mistake a transient animation frame for a persistently hidden focus.
const auditTabSequence = async (name, route, limit, minItems, { adminTab = null } = {}) => {
  await page.goto(new URL(route, origin).href, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(280);
  if (adminTab !== null) {
    await page.getByRole('tab').nth(adminTab).click();
    await page.locator('[class*=tableWrap]').waitFor();
  }
  await page.evaluate(() => {
    document.activeElement?.blur();
    window.__postifyQaFocused = new WeakSet();
  });
  // Begin within the labeled horizontal-scroll region on admin tables.
  if (adminTab !== null) await page.locator('[class*=tableWrap]').focus();
  const issues = [];
  let count = 0;
  for (let i = 0; i < limit; i += 1) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(235);
    const entry = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body || el === document.documentElement) return null;
      if (window.__postifyQaFocused.has(el)) return { repeated: true };
      window.__postifyQaFocused.add(el);
      const rect = el.getBoundingClientRect();
      const left = Math.max(0, rect.left), right = Math.min(innerWidth, rect.right);
      const top = Math.max(0, rect.top), bottom = Math.min(innerHeight, rect.bottom);
      const visible = right > left && bottom > top;
      let occluded = false;
      if (visible) {
        const above = document.elementFromPoint((left + right) / 2, (top + bottom) / 2);
        occluded = Boolean(above && !el.contains(above) && !above.contains(el));
      }
      return {
        tag: el.tagName,
        name: (el.getAttribute('aria-label') || el.textContent || el.id || '').trim().slice(0, 64),
        visible, occluded, focusVisible: el.matches(':focus-visible'),
      };
    });
    if (!entry || entry.repeated) break;
    count += 1;
    if (!entry.visible || entry.occluded || !entry.focusVisible) issues.push({ index: i, ...entry });
  }
  const pass = count >= minItems && issues.length === 0;
  focusRuns.push({ name, zoom: '400%', checkedControls: count, issues, pass });
  console.log(`${pass ? 'PASS' : 'FAIL'} 400% ${name} keyboard Tab focus: ${count} controls, ${issues.length} hidden/obscured/no-focus-ring`);
  if (!pass) errors.push(`${name} native 400% focus audit: ${count} controls (min ${minItems}), issues ${JSON.stringify(issues)}`);
};

try {
  await page.goto(new URL('/e2e/visual/bookmarks-legacy.html', origin).href);
  const chromeWindows = execFileSync('xdotool', ['search', '--onlyvisible', '--class', 'chromium'])
    .toString().trim().split('\n');
  assert(chromeWindows.length > 0 && chromeWindows.at(-1), 'No dedicated visible Chromium window');
  execFileSync('xdotool', ['windowfocus', '--sync', chromeWindows.at(-1)]);

  for (const [label, extraSteps, expectedRatio] of [['100%', 0, 1], ['200%', 5, 2], ['400%', 3, 4]]) {
    await pressNativeZoom(extraSteps);
    const ratio = (await sample()).zoom;
    assert(Math.abs(ratio - expectedRatio) < 0.025, `Native ${label} failed: DPR was ${ratio}; refusing simulated-zoom evidence`);

    for (const [name, route] of routes) {
      await page.goto(new URL(route, origin).href, { waitUntil: 'domcontentloaded', timeout: 18000 });
      await page.waitForTimeout(200);
      const metrics = await sample();
      const overflow = Math.max(0, metrics.scrollWidth - metrics.clientWidth);
      const pass = Math.abs(metrics.zoom - expectedRatio) < .025 &&
        Math.abs(metrics.cssWidth - 1280 / expectedRatio) <= 1 &&
        overflow <= 1 && metrics.mainCount === 1 && metrics.h1Count >= 1;
      const row = { label, route: name, ...metrics, overflow, pass };
      results.push(row);
      console.log(`${pass ? 'PASS' : 'FAIL'} ${label} ${name}: CSS ${metrics.cssWidth}px; overflow ${overflow}px; main ${metrics.mainCount}; h1 ${metrics.h1Count}`);
      if (!pass) errors.push(`${label}/${name} failed geometry or semantic landmark check`);
    }

    if (label === '400%') {
      // Verify protected form control focus and hit areas without submitting credentials.
      await page.goto(new URL('/auth/login', origin).href);
      for (const selector of ['#email', '#password', 'button[type="submit"]']) {
        const control = page.locator(selector).first();
        await control.focus();
        assert(await control.evaluate((el) => document.activeElement === el), `400% login ${selector} keyboard focus missing`);
        const bounds = await control.boundingBox();
        assert(bounds?.width > 0 && bounds.height >= 24 && bounds.x >= -1 && bounds.x + bounds.width <= 321,
          `400% login ${selector} clipped or inaccessible: ${JSON.stringify(bounds)}`);
      }
      console.log('PASS 400% login: email, password and submit keyboard focus / horizontal bounds');

      // Test a real interactive, account-scoped screen at true 400% browser zoom.
      await page.goto(new URL('/e2e/visual/bookmarks-legacy.html', origin).href);
      const confirmation = page.getByRole('checkbox', { name: /I confirm these old device records belong to me|bana ait olduğunu doğruluyorum/i });
      const importButton = page.getByRole('button', { name: /Import into this account|Bu hesaba aktar/i });
      await confirmation.focus();
      assert(await confirmation.evaluate((el) => document.activeElement === el), '400% checkbox keyboard focus missing');
      await page.keyboard.press('Space');
      assert(await confirmation.isChecked(), '400% Space did not acknowledge ownership');
      await importButton.focus();
      const rect = await importButton.boundingBox();
      assert(rect?.width > 0 && rect.height >= 44 && rect.x >= -1 && rect.x + rect.width <= 321,
        `400% import button clipped or below touch target: ${JSON.stringify(rect)}`);
      await page.keyboard.press('Enter');
      await page.locator('article').first().waitFor();
      assert(await page.locator('article').count() === 2, '400% keyboard import did not restore both archived entries');
      console.log('PASS 400% legacy import: keyboard Space + Enter, 44px target, no clipping');
      await auditTabSequence('login', '/auth/login', 34, 12);
      await auditTabSequence('home', '/', 48, 18);
      await auditTabSequence('bookmark-legacy', '/e2e/visual/bookmarks-legacy.html', 12, 2);
      await auditTabSequence('bookmark-populated', '/e2e/visual/bookmarks-auth.html', 24, 5);
      await auditTabSequence('editor', '/e2e/visual/editor.html', 55, 12);
      await auditTabSequence('knowledge', '/e2e/visual/knowledge-auth.html', 30, 3);
      await auditTabSequence('admin-users', '/e2e/visual/admin-auth.html', 12, 4, { adminTab: 1 });
      await auditTabSequence('admin-posts', '/e2e/visual/admin-auth.html', 18, 9, { adminTab: 2 });
    }
  }
} finally {
  writeFileSync(reportPath, JSON.stringify({ results, focusRuns, errors }, null, 2));
  await browser.close();
}
console.log(`Native browser zoom release audit: ${results.filter((r) => r.pass).length}/${results.length} route states, ${focusRuns.filter((r) => r.pass).length}/${focusRuns.length} keyboard focus sequences, ${errors.length} failures. Report ${reportPath}`);
if (errors.length) process.exitCode = 1;
