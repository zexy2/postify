import { test, expect } from '@playwright/test';

const viewports = [320, 390, 820, 1440];

for (const width of viewports) {
  for (const theme of ['light', 'dark']) {
    test(`Knowledge account maintenance ${width}px ${theme} hit targets and evidence gating`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript((value) => {
        localStorage.setItem('postify_language', 'en');
        localStorage.setItem('postify_theme', value);
      }, theme);
      await page.goto('/e2e/visual/knowledge-auth.html');
      await expect(page.getByRole('heading', { level: 1, name: /keep useful knowledge current/i })).toBeVisible();
      const queue = page.locator('article[data-freshness]');
      await expect(queue).toHaveCount(3);
      const targets = queue.locator('a[href$="/edit"], button');
      const heights = await targets.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().height));
      expect(heights).toHaveLength(6);
      for (const height of heights) expect(height).toBeGreaterThanOrEqual(43.5);
      await expect(queue.first().getByRole('button', { name: /^re-verify$/i })).toBeEnabled();
      await expect(queue.last().getByRole('button', { name: /^re-verify$/i })).toBeDisabled();
      const edit = queue.first().getByRole('link', { name: /edit evidence/i });
      await expect(edit).toHaveAttribute('href', '/posts/k1/edit');
      await edit.focus();
      await expect(edit).toBeFocused();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
}

for (const width of [320, 820, 1440]) {
  test(`Knowledge unavailable ${width}px recovery actions`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => localStorage.setItem('postify_language', 'en'));
    await page.goto('/e2e/visual/knowledge-unavailable.html');
    await expect(page.getByRole('heading', { level: 1, name: /account sync is not active yet/i })).toBeVisible();
    const links = page.getByRole('navigation', { name: 'Available account actions' }).getByRole('link');
    await expect(links).toHaveCount(2);
    for (const height of await links.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().height))) {
      expect(height).toBeGreaterThanOrEqual(44);
    }
    await expect(links.first()).toHaveAttribute('href', '/profile');
    await expect(links.last()).toHaveAttribute('href', '/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
