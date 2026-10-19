import { test, expect } from '@playwright/test';

// First public Home slice: approved dark editorial cover with page-local
// PL-01 tokens, real featured cover, functional navigation and mobile reflow.
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
      expect(color).toBe(theme === 'light' ? 'rgb(31, 36, 32)' : 'rgb(34, 42, 38)');
      const headingStyle = await h1.evaluate((element) => {
        const style = getComputedStyle(element);
        return { color: style.color, family: style.fontFamily };
      });
      expect(headingStyle.color).toBe('rgb(239, 237, 229)');
      expect(headingStyle.family).toMatch(/Fraunces/);
      const featured = hero.locator('a[href^="/posts/"]').filter({ has: page.locator('img') }).first();
      await expect(featured).toBeVisible();
      const image = featured.locator('img');
      await expect(image).toBeVisible();
      await expect.poll(() => image.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
      expect(await image.getAttribute('srcset')).toMatch(/responsive\/.*-480\.webp 480w/);
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
