import { expect, test } from '@playwright/test';
import { getFallbackPosts } from '../../src/content/fallbackPosts.js';

const [fallbackPost] = getFallbackPosts('en');

// Functional release gates independent of the unapproved Article golden PNGs.
// Keep the reading experience accessible while owner reviews visual differences.
for (const theme of ['light', 'dark']) {
  for (const width of [320, 390, 1440]) {
    test(`Article reading layout ${theme} at ${width}px: contained, semantic and accessible`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.addInitScript((value) => {
        localStorage.setItem('postify_theme', value);
        localStorage.setItem('postify_language', 'en');
      }, theme);
      await page.goto(`/posts/${fallbackPost.slug}`);
      const article = page.locator('main article').first();
      const heading = article.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
      await expect(heading).toContainText(fallbackPost.title);
      const brief = article.getByRole('region', { name: /quick brief|before you read|hızlı özet/i });
      await expect(brief).toBeVisible();
      const image = article.locator('img').first();
      await expect(image).toBeVisible();
      await expect(image).toHaveAttribute('alt', /.+/);
      const position = await page.evaluate(() => {
        const element = document.querySelector('main article h1');
        const rect = element?.getBoundingClientRect();
        return { viewport: innerWidth, pageWidth: document.documentElement.scrollWidth,
          headingLeft: rect?.left, headingRight: rect?.right, headingWidth: rect?.width };
      });
      expect(position.pageWidth, 'horizontal document overflow').toBeLessThanOrEqual(position.viewport + 1);
      expect(position.headingLeft, 'heading clipped on left').toBeGreaterThanOrEqual(-1);
      expect(position.headingRight, 'heading clipped on right').toBeLessThanOrEqual(position.viewport + 1);
      expect(position.headingWidth, 'heading width').toBeGreaterThan(180);
      await expect(article.locator('p').first()).toBeVisible();

      if (width < 980) {
        const toolbar = page.locator('[data-mobile-article-tools]');
        await expect(toolbar).toBeAttached();
        const buttons = toolbar.getByRole('button');
        const sizes = await buttons.evaluateAll((nodes) => nodes.map((node) => {
          const rect = node.getBoundingClientRect();
          return { width: rect.width, height: rect.height, name: node.getAttribute('aria-label') || node.getAttribute('title') };
        }));
        expect(sizes.length).toBeGreaterThanOrEqual(2);
        for (const size of sizes) {
          expect(size.width, `Mobile tool ${size.name} width`).toBeGreaterThanOrEqual(44);
          expect(size.height, `Mobile tool ${size.name} height`).toBeGreaterThanOrEqual(44);
          expect(size.name, 'Mobile tool requires an accessible name').toBeTruthy();
        }
      }
    });
  }
}
