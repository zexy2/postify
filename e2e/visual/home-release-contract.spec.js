import { test, expect } from '@playwright/test';

// The released premium editorial Home may use a light paper cover by day and
// a dark ink cover by night. Keep functional, focus and overflow contracts.
for (const theme of ['light', 'dark']) {
  for (const width of [320, 390, 768, 1440]) {
    test('Home PL-01 ' + theme + ' ' + width + 'px remains legible and functional', async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript((value) => {
        localStorage.setItem('postify_theme', value);
        localStorage.setItem('postify_language', 'en');
      }, theme);
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto('/');
      const h1 = page.locator('#main-content h1').first();
      await expect(h1).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const hero = h1.locator('xpath=ancestor::section[1]');
      const color = await hero.evaluate((element) => getComputedStyle(element).backgroundColor);
      expect(color).toBe(theme === 'light' ? 'rgb(243, 244, 241)' : 'rgb(23, 27, 34)');
      const headingStyle = await h1.evaluate((element) => {
        const style = getComputedStyle(element);
        return { color: style.color, family: style.fontFamily };
      });
      expect(headingStyle.color).toBe(theme === 'light' ? 'rgb(21, 24, 28)' : 'rgb(232, 235, 238)');
      expect(headingStyle.family).toMatch(/Bricolage/);
      // The featured record carries a cover generated from its own evidence record.
      const featured = hero.locator('a[href^="/posts/"]').filter({ has: page.locator('svg[data-state]') }).first();
      await expect(featured).toBeVisible();
      await expect(featured.locator('svg[data-state]')).toHaveAttribute('data-type', /guide|decision|explainer|fieldNote/);
      // The proof receipt replays a published run and can be replayed by the reader.
      const receipt = hero.getByRole('figure', { name: /verification record/i });
      await expect(receipt).toBeVisible();
      await expect(receipt.getByRole('button', { name: /replay recorded run/i })).toBeVisible();
      const anchor = hero.locator('a[href="#knowledge-feed"]');
      await expect(anchor).toBeVisible();
      expect((await anchor.boundingBox()).height).toBeGreaterThanOrEqual(44);
      await anchor.focus();
      await expect(anchor).toBeFocused();
      expect(await anchor.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none');
      await expect(page.locator('#knowledge-feed')).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
      expect(errors).toEqual([]);
    });
  }
}

for (const width of [320, 390]) {
  test('Home Turkish mobile ' + width + 'px keeps featured and readable archive actions', async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.addInitScript(() => {
      localStorage.setItem('postify_language', 'tr');
      localStorage.setItem('postify_theme', 'light');
    });
    await page.goto('/');
    await expect(page.locator('#main-content h1').first()).toBeVisible();
    await expect(page.getByRole('searchbox').first()).toBeVisible();
    await expect(page.locator('a[href="#knowledge-feed"]').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  });
}
