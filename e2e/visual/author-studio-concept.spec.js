import { test, expect } from '@playwright/test';

// Author Studio proposal. This protects responsive functionality and legibility,
// but does not imply approval of the historic visual screenshot goldens.
const themes = ['light', 'dark'];
const widths = [320, 390, 1440];

for (const theme of themes) {
  for (const width of widths) {
    test(`Author Studio public profile ${theme} at ${width}px retains reading and keyboard actions`, async ({ page }) => {
      await page.setViewportSize({ width, height: 850 });
      await page.addInitScript((value) => {
        localStorage.setItem('postify_theme', value);
        localStorage.setItem('postify_language', 'en');
      }, theme);
      await page.goto('/users/fallback-editor');
      const profile = page.locator('main').first();
      const hero = profile.locator('header').first();
      await expect(profile.getByRole('heading', { level: 1, name: 'Postify Editor' })).toBeVisible();
      await expect(hero.getByText(/Postify editor/i).first()).toBeVisible();
      const art = await hero.evaluate((node) => {
        const luminance = (rgb) => rgb.map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
          .reduce((sum, v, index) => sum + v * [0.2126, 0.7152, 0.0722][index], 0);
        const style = getComputedStyle(node);
        const title = node.querySelector('h1');
        const titleStyle = getComputedStyle(title);
        const rgb = (value) => [...value.matchAll(/[\d.]+/g)].slice(0, 3).map((match) => Number(match[0]) / 255);
        const titleLum = luminance(rgb(titleStyle.color));
        const darkBase = luminance([25 / 255, 47 / 255, 43 / 255]);
        return {
          gradient: style.backgroundImage.includes('gradient'),
          rounded: Number.parseFloat(style.borderTopLeftRadius) >= 16,
          titleContrast: (Math.max(titleLum, darkBase) + 0.05) / (Math.min(titleLum, darkBase) + 0.05),
          sans: /Inter|sans-serif/i.test(titleStyle.fontFamily),
          overflow: document.documentElement.scrollWidth - innerWidth,
          titleRight: title.getBoundingClientRect().right,
        };
      });
      expect(art.gradient).toBe(true);
      expect(art.rounded).toBe(true);
      expect(art.sans).toBe(true);
      expect(art.titleContrast).toBeGreaterThanOrEqual(4.5);
      expect(art.overflow).toBeLessThanOrEqual(1);
      expect(art.titleRight).toBeLessThanOrEqual(width + 1);
      const cta = hero.getByRole('link', { name: /explore published work/i });
      await expect(cta).toHaveAttribute('href', '#published-work');
      const bounds = await cta.boundingBox();
      expect(bounds?.height).toBeGreaterThanOrEqual(44);
      await expect(profile.getByRole('region', { name: /author knowledge summary/i })).toBeVisible();
      const stats = profile.getByRole('region', { name: /author knowledge summary/i }).locator('strong');
      await expect(stats).toHaveCount(3);
      await expect(profile.getByRole('heading', { name: /published work/i })).toBeVisible();
      await expect(profile.locator('#published-work article').first()).toBeVisible();
      await cta.click();
      await expect(page).toHaveURL(/#published-work$/);
    });
  }
}

for (const { path, recovery } of [
  { path: '/users/missing-author', recovery: 'link' },
  { path: '/e2e/visual/author-error.html', recovery: 'button' },
  { path: '/e2e/visual/author-posts-error.html', recovery: 'button' },
]) {
  test(`Author Studio ${path} keeps clear mobile recovery`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const control = recovery === 'link'
      ? page.getByRole('link', { name: /explore useful knowledge|işe yarayan/i })
      : page.getByRole('button', { name: /try again|tekrar dene/i });
    await expect(control).toBeVisible();
    expect((await control.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
