import { test, expect } from '@playwright/test';

// A reversible Article Studio design concept; not owner acceptance of new goldens.
for (const theme of ['light', 'dark']) {
  for (const width of [320, 390, 1440]) {
    test(`Article Studio concept keeps reading UX usable in ${theme} ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 850 });
      await page.addInitScript((value) => {
        localStorage.setItem('postify_theme', value);
        localStorage.setItem('postify_language', 'en');
      }, theme);
      await page.goto('/posts/ai-muhendisligi');
      const article = page.locator('main article');
      const header = article.locator('header').first();
      const title = header.getByRole('heading', { level: 1 });
      await expect(title).toBeVisible();
      const design = await header.evaluate((element) => {
        const heading = element.querySelector('h1');
        const top = element.getBoundingClientRect();
        const h = heading.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          fontFamily: getComputedStyle(heading).fontFamily,
          titleWithinHeader: h.left >= top.left && h.right <= top.right,
          gradient: style.backgroundImage.includes('gradient'),
          rounded: Number.parseFloat(style.borderTopLeftRadius) > 14,
          titleColor: getComputedStyle(heading).color,
          viewportOverflow: document.documentElement.scrollWidth - innerWidth,
        };
      });
      expect(design.fontFamily).toMatch(/Inter|sans-serif/i);
      expect(design.gradient).toBe(true);
      expect(design.rounded).toBe(true);
      expect(design.titleWithinHeader).toBe(true);
      expect(design.viewportOverflow).toBeLessThanOrEqual(1);
      expect(design.titleColor).toBe('rgb(248, 250, 245)');
      // A dark-in-both-themes cover must override the light-theme global
      // verification green, which otherwise fails WCAG text contrast.
      const evidenceContrast = await header.locator('.evidence-badge strong').first().evaluate((element) => {
        const channels = (color) => [...color.matchAll(/[\d.]+/g)].slice(0, 3).map((match) => Number(match[0]) / 255);
        const luminance = (channelsRgb) => channelsRgb.map((value) => value <= 0.04045
          ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
          .reduce((total, value, i) => total + value * [0.2126, 0.7152, 0.0722][i], 0);
        const textLum = luminance(channels(getComputedStyle(element).color));
        const surfaceLum = luminance([23 / 255, 44 / 255, 42 / 255]); // actual dark hero base
        return (Math.max(textLum, surfaceLum) + 0.05) / (Math.min(textLum, surfaceLum) + 0.05);
      });
      expect(evidenceContrast, 'verification state on dark hero').toBeGreaterThanOrEqual(4.5);
      const cover = article.locator('[class*="coverWrapper"]');
      const brief = article.getByRole('region', { name: /quick brief|before you read/i });
      await expect(cover).toBeVisible();
      await expect(brief).toBeVisible();
      const coverThenBrief = await cover.evaluate((node) => {
        const sibling = node.nextElementSibling;
        return sibling?.tagName === 'SECTION' && sibling.querySelector('strong') !== null;
      });
      expect(coverThenBrief).toBe(true);
      await expect(article.locator('img').first()).toHaveAttribute('alt', /.+/);
      if (width < 980) {
        const controls = page.locator('[data-mobile-article-tools]').getByRole('button');
        const sizes = await controls.evaluateAll((buttons) => buttons.map((button) => {
          const rect = button.getBoundingClientRect();
          return [rect.width, rect.height];
        }));
        expect(sizes.length).toBeGreaterThan(1);
        for (const [buttonWidth, buttonHeight] of sizes) {
          expect(buttonWidth).toBeGreaterThanOrEqual(44);
          expect(buttonHeight).toBeGreaterThanOrEqual(44);
        }
      }
    });
  }
}
