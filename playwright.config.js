import { defineConfig, devices } from '@playwright/test';

const playwrightPort = process.env.PLAYWRIGHT_PORT || '4173';
const localBaseURL = `http://127.0.0.1:${playwrightPort}/`;
const artifactTag = process.env.PLAYWRIGHT_ARTIFACT_TAG || process.env.GITHUB_RUN_ID || String(process.pid);
const outputDir = process.env.PLAYWRIGHT_OUTPUT_DIR || `/tmp/postify-test-results-${artifactTag}`;
const reportDir = process.env.PLAYWRIGHT_HTML_REPORT || `/tmp/postify-playwright-report-${artifactTag}`;

/**
 * Playwright Configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  outputDir,
  reporter: [['html', { outputFolder: reportDir, open: 'never' }]],
  
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || localBaseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: `npm run preview -- --host 0.0.0.0 --port ${playwrightPort} --strictPort`,
    url: localBaseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
