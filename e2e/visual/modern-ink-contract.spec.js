import { test, expect } from '@playwright/test';

// Public editorial semantics, contrast, focus, route anchors and themed art
// remain guarded across the distinct new sage About and terra-cotta Contact.
for (const route of ['/about', '/contact']) {
  for (const theme of ['light', 'dark']) {
    for (const width of [320, 390, 768, 1440]) {
      test(`oxide editorial ${route} ${theme} ${width}px preserves public semantics`, async ({ page }) => {
        await page.setViewportSize({ width, height: 860 });
        await page.addInitScript((value) => {
          localStorage.setItem('postify_theme', value);
          localStorage.setItem('postify_language', 'en');
        }, theme);
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(route);
        await page.evaluate(() => document.fonts.ready);

        const hero = page.locator('header').filter({ has: page.getByRole('heading', { level: 1 }) }).first();
        const h1 = hero.getByRole('heading', { level: 1 });
        await expect(h1).toBeVisible();
        const info = await h1.evaluate((element) => {
          const frame = element.closest('header').getBoundingClientRect();
          const box = element.getBoundingClientRect();
          const bg = getComputedStyle(element.closest('header')).backgroundImage;
          const front = getComputedStyle(element).color;
          return {
            background: bg,
            front,
            left: box.left,
            right: box.right,
            frameLeft: frame.left,
            frameRight: frame.right,
            pageWidth: document.documentElement.scrollWidth,
            viewportWidth: window.innerWidth,
          };
        });
        expect(info.background).toMatch(/radial-gradient/i);
        expect(info.background).toContain(theme === 'light' ? (route === '/about' ? '123, 155, 107' : '188, 99, 70') : (route === '/about' ? '161, 56, 38' : '174, 69, 43'));
        expect(info.front).toBe(theme === 'dark' ? 'rgb(239, 237, 229)' : (route === '/about' ? 'rgb(32, 49, 39)' : 'rgb(48, 39, 34)'));
        expect(info.right).toBeLessThanOrEqual(info.frameRight + 1);
        expect(info.left).toBeGreaterThanOrEqual(info.frameLeft - 1);
        expect(info.pageWidth).toBeLessThanOrEqual(info.viewportWidth + 1);
        const accentedPhrase = h1.locator('em');
        await expect(accentedPhrase).toBeVisible();
        const headlineArt = await accentedPhrase.evaluate((element) => {
          const computed = getComputedStyle(element);
          return { font: computed.fontFamily, color: computed.color };
        });
        expect(headlineArt.font).toMatch(/Fraunces/i); // Italic evidence phrase retains the editorial accent face.
        expect(headlineArt.color).toBe(theme === 'dark' ? 'rgb(242, 172, 145)' : (route === '/about' ? 'rgb(147, 64, 39)' : 'rgb(160, 66, 42)'));
        const art = hero.locator('[class*="heroArtwork"]');
        await expect(art).toBeVisible();
        if (width <= 390) {
          const rect = await art.boundingBox();
          expect(rect.height).toBeLessThanOrEqual(235);
        }
        // The outer reading canvas follows PL-01 paper by day, warm ink by night.
        const canvasColor = await page.locator('#main-content > div').first().evaluate((el) => getComputedStyle(el).backgroundColor);
        expect(canvasColor).toBe(theme === 'light' ? 'rgb(244, 239, 230)' : 'rgb(21, 27, 25)');
        expect(errors).toEqual([]);

        const primaryAnchor = hero.locator('a[href^="#"]').first();
        await expect(primaryAnchor).toBeVisible();
        const targetId = await primaryAnchor.getAttribute('href');
        expect(targetId).toMatch(/^#[a-z][a-z0-9-]+$/i);
        await expect(page.locator(targetId)).toHaveCount(1);
        expect((await primaryAnchor.boundingBox())?.height).toBeGreaterThanOrEqual(44);
        await primaryAnchor.focus();
        await expect(primaryAnchor).toBeFocused();
        expect(await primaryAnchor.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none');

        if (route === '/about') {
          const artworkStatement = art.locator('[class*="artworkStatement"]');
          await expect(artworkStatement).toBeVisible();
          expect(await artworkStatement.evaluate((element) => getComputedStyle(element).color)).toBe(theme === 'dark' ? 'rgb(244, 239, 230)' : 'rgb(247, 244, 232)');
          await expect(page.getByRole('region', { name: /no magic score/i }).locator('article')).toHaveCount(4);
          await expect(page.getByRole('region', { name: /the shape follows/i }).locator('article')).toHaveCount(4);
          await expect(page.locator('#main-content').getByRole('link', { name: /explore knowledge/i })).toHaveAttribute('href', '/');
          await expect(page.locator('#main-content').getByRole('link', { name: /write a useful record/i })).toHaveAttribute('href', '/posts/create');
        } else {
          const channels = page.getByRole('region', { name: /direct channels/i });
          await expect(channels.getByRole('link', { name: /zekiakgul09@gmail.com/i })).toHaveAttribute('href', 'mailto:zekiakgul09@gmail.com');
          await expect(channels.getByRole('link', { name: /@zexy2/i })).toHaveAttribute('href', 'https://github.com/zexy2');
          for (const link of await channels.locator('a').all()) {
            const box = await link.boundingBox();
            expect(box.height).toBeGreaterThanOrEqual(44);
          }
          await expect(page.getByRole('region', { name: /good reasons to reach out/i }).locator(':scope > div:last-child > div')).toHaveCount(3);
          await expect(page.locator('main form')).toHaveCount(0);
        }
      });
    }
  }
}

for (const route of ['/about', '/contact']) {
  test(`oxide editorial ${route} Turkish 320px preserves localized copy without side scroll`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.addInitScript(() => localStorage.setItem('postify_language', 'tr'));
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
}
