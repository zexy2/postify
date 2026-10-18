/**
 * Isolated Chromium lab guard for the first mobile hamburger click.
 * Recreate production build separately and serve via vite preview on localhost.
 * Example: MOBILE_MENU_PERF_URL=http://127.0.0.1:4445 node scripts/qa/mobile-menu-startup.mjs
 * Uses Chromium 4x CPU + 150ms RTT / ~1.5 Mbps simulated throughput. Not field CWV.
 */
import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';

const site = new URL(process.env.MOBILE_MENU_PERF_URL || 'http://127.0.0.1:4445/');
if (site.protocol !== 'http:' || !['127.0.0.1', 'localhost'].includes(site.hostname)) {
  throw new Error('QA benchmark requires a local, nonproduction HTTP preview');
}
const reportPath = process.env.MOBILE_MENU_PERF_REPORT || '/tmp/postify-mobile-menu-startup.json';
const maxDelay = Number(process.env.MOBILE_MENU_MAX_DELAY_MS || 900);
const repeat = 3;
const samples = [];
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  for (let i = 0; i < repeat; i += 1) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    try {
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.emulateNetworkConditions', {
        offline: false, latency: 150, downloadThroughput: 190000, uploadThroughput: 87000,
      });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await page.goto(site.href, { waitUntil: 'domcontentloaded', timeout: 35000 });
      await page.waitForLoadState('networkidle', { timeout: 20000 });
      const bootstrap = await page.evaluate(() => {
        const scripts = performance.getEntriesByType('resource')
          .filter((entry) => /\.js(?:$|\?)/.test(entry.name));
        return {
          sheetPreloaded: scripts.some((entry) => /\/assets\/sheet-[^/]+\.js(?:$|\?)/.test(entry.name)),
          jsTransferBytes: scripts.reduce((total, entry) => total + entry.transferSize, 0),
        };
      });
      const menu = page.locator('header button[aria-expanded]').first();
      const start = Date.now();
      await menu.click();
      await page.getByRole('button', { name: /close menu|menüyü kapat/i })
        .waitFor({ state: 'visible', timeout: 12000 });
      const latencyMs = Date.now() - start;
      const sample = { iteration: i + 1, latencyMs, ...bootstrap };
      samples.push(sample);
      console.log(`MOBILE_MENU_RUN ${JSON.stringify(sample)}`);
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
const passed = samples.length === repeat &&
  samples.every((sample) => sample.sheetPreloaded && sample.latencyMs < maxDelay);
writeFileSync(reportPath, JSON.stringify({
  target: site.href, samples, thresholdMs: maxDelay, passed,
  profile: { cpuMultiplier: 4, rttMs: 150, downloadBytesPerSecond: 190000 },
  limitations: 'Headless Chrome lab data only; no field CWV or all-device guarantee.',
}, null, 2));
console.log(`MOBILE_MENU_LAB ${passed ? 'PASS' : 'FAIL'} ${samples.length}/${repeat}; report ${reportPath}`);
if (!passed) process.exitCode = 1;
