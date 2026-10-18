import { test, expect } from '@playwright/test';

const cases = [
  { route: '/about', title: /useful knowledge should survive contact with reality/i },
  { route: '/contact', title: /useful knowledge gets better when readers can challenge it/i },
];

for (const { route, title } of cases) {
  for (const theme of ['light', 'dark']) {
    for (const width of [320, 390, 1440]) {
      test(`Studio static ${route} ${theme} ${width}px remains legible and actionable`, async ({ page }) => {
        await page.setViewportSize({ width, height: 850 });
        await page.addInitScript((value) => {
          localStorage.setItem('postify_theme', value);
          localStorage.setItem('postify_language', 'en');
        }, theme);
        await page.goto(route);
        const heading = page.getByRole('heading', { level: 1, name: title });
        await expect(heading).toBeVisible();
        const geometric = await heading.evaluate((h1) => {
          const panel = h1.closest('header');
          const frame = panel.getBoundingClientRect();
          const box = h1.getBoundingClientRect();
          const css = getComputedStyle(panel);
          const titleCSS = getComputedStyle(h1);
          const channels = (color) => [...color.matchAll(/[\d.]+/g)].slice(0, 3).map((m) => Number(m[0]) / 255);
          const lum = (rgb) => rgb.map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
            .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
          const a = lum(channels(titleCSS.color));
          const b = lum([23 / 255, 48 / 255, 41 / 255]);
          return {
            contrast: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
            fontFamily: titleCSS.fontFamily,
            gradient: css.backgroundImage.includes('gradient'),
            radius: Number.parseFloat(css.borderTopLeftRadius),
            overflow: document.documentElement.scrollWidth - innerWidth,
            titleInside: box.left >= frame.left - 1 && box.right <= frame.right + 1,
          };
        });
        expect(geometric.contrast).toBeGreaterThanOrEqual(4.5);
        expect(geometric.fontFamily).toMatch(/Inter|sans-serif/i);
        expect(geometric.gradient).toBe(true);
        expect(geometric.radius).toBeGreaterThanOrEqual(16);
        expect(geometric.overflow).toBeLessThanOrEqual(1);
        expect(geometric.titleInside).toBe(true);

        if (route === '/about') {
          const trust = page.getByRole('region', { name: /no magic score|sihirli puan/i });
          await expect(trust).toBeVisible();
          await expect(trust.locator('article')).toHaveCount(4);
          const formats = page.getByRole('region', { name: /the shape follows|biçimi problemi/i });
          await expect(formats.locator('article')).toHaveCount(4);
          for (const link of [page.locator('[class*="ctaActions"]').getByRole('link', { name: /explore knowledge/i }), page.locator('[class*="ctaActions"]').getByRole('link', { name: /write a useful record/i })]) {
            await expect(link).toBeVisible();
            expect((await link.boundingBox())?.height).toBeGreaterThanOrEqual(44);
          }
        } else {
          const channels = page.getByRole('region', { name: /direct channels/i });
          await expect(channels).toBeVisible();
          const email = channels.getByRole('link', { name: /zekiakgul09@gmail.com/i });
          await expect(email).toHaveAttribute('href', 'mailto:zekiakgul09@gmail.com');
          const github = channels.getByRole('link', { name: /@zexy2/i });
          await expect(github).toHaveAttribute('href', 'https://github.com/zexy2');
          await expect(github).toHaveAttribute('rel', /noopener/);
          for (const link of [email, github]) {
            await expect(link).toBeVisible();
            expect((await link.boundingBox())?.height).toBeGreaterThanOrEqual(44);
          }
          const reasons = page.getByRole('region', { name: /good reasons to reach out/i });
          await expect(reasons.locator(':scope > div:last-child > div')).toHaveCount(3);
        }
      });
    }
  }
}

for (const route of ['/about', '/contact']) {
  test(`Static Studio ${route} retains Turkish content and actions`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.addInitScript(() => localStorage.setItem('postify_language', 'tr'));
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(horizontalOverflow).toBeLessThanOrEqual(1);
    await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible();
  });
}
