import { expect, test } from '@playwright/test';

// Functional release checks for the already-approved Home masthead and its
// still-unapproved filter/empty-state screenshot references. No golden updates.
const prepare = async (page, width, height, language = 'en', theme = 'light') => {
  await page.setViewportSize({ width, height });
  await page.addInitScript(({ language: lang, theme: t }) => {
    localStorage.setItem('postify_language', lang);
    localStorage.setItem('postify_theme', t);
  }, { language, theme });
  await page.goto('/');
  await expect(page.locator('#knowledge-feed')).toBeVisible();
};

for (const width of [320, 390, 1440]) {
  test(`Home unknown search at ${width}px provides safe reset`, async ({ page }) => {
    await prepare(page, width, 850, 'en', width === 390 ? 'dark' : 'light');
    const term = 'zzzz-release-query-not-found';
    const search = page.getByRole('searchbox').first();
    await search.fill(term);
    const empty = page.locator('[data-home-state="empty"]');
    await expect(empty).toBeVisible();
    await expect(empty).toContainText(term);
    const reset = empty.getByRole('button', { name: /clear filters|reset filters/i });
    await expect(reset).toBeVisible();
    expect((await reset.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await reset.click();
    await expect(search).toHaveValue('');
    await expect(empty).toBeHidden();
    await expect(page.locator('#knowledge-feed article').first()).toBeVisible();
  });
}

for (const [width, height] of [[320, 650], [390, 844], [568, 320], [1440, 900]]) {
  test(`Discovery filter dialog contained and keyboard-dismissible ${width}×${height}`, async ({ page }) => {
    await prepare(page, width, height, 'en', width === 390 ? 'dark' : 'light');
    const group = page.getByRole('group', { name: /discovery filters/i });
    const toggle = group.getByRole('button', { name: /^filters$/i });
    await toggle.click();
    const dialog = group.getByRole('dialog', { name: /^filters$/i });
    await expect(dialog).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const bounds = await dialog.boundingBox();
    expect(bounds?.x).toBeGreaterThanOrEqual(-1);
    expect(bounds?.y).toBeGreaterThanOrEqual(-1);
    expect((bounds?.x ?? width) + (bounds?.width ?? 0)).toBeLessThanOrEqual(width + 1);
    expect((bounds?.y ?? height) + (bounds?.height ?? 0)).toBeLessThanOrEqual(height + 1);
    for (const button of await dialog.getByRole('button').all()) {
      const rect = await button.boundingBox();
      expect(rect?.height, 'filter touch size').toBeGreaterThanOrEqual(44);
    }
    const latest = dialog.getByRole('button', { name: /^latest$/i });
    await latest.click();
    await expect(latest).toHaveAttribute('aria-pressed', 'true');
    await expect(page).toHaveURL(/sort=latest/);
    await dialog.getByRole('button', { name: /clear filters/i }).click();
    await expect(latest).toHaveAttribute('aria-pressed', 'false');
    await expect(page).not.toHaveURL(/sort=latest/);
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(toggle).toBeFocused();
  });
}

for (const width of [320, 390]) {
  test(`Mobile nav and command search remain keyboard safe at ${width}px`, async ({ page }) => {
    await prepare(page, width, 844, 'en', 'dark');
    const open = page.getByRole('button', { name: /toggle menu/i });
    await open.click();
    const drawer = page.getByRole('dialog').first();
    await expect(drawer).toBeVisible();
    expect((await drawer.boundingBox())?.width).toBeLessThanOrEqual(width + 1);
    await page.keyboard.press('Escape');
    await expect(drawer).toHaveCount(0);
    await page.keyboard.press('Control+K');
    const palette = page.getByRole('dialog', { name: /search/i });
    await expect(palette).toBeVisible();
    const input = palette.getByRole('combobox');
    await expect(input).toBeFocused();
    const controls = await palette.getByRole('option').all();
    expect(controls.length).toBeGreaterThan(0);
    for (const item of controls) {
      const box = await item.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
    await page.keyboard.press('Escape');
    await expect(palette).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
}
