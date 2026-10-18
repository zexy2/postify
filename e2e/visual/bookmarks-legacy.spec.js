import { test, expect } from '@playwright/test';

for (const width of [320, 1440]) {
  test(`legacy archive import requires explicit consent at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/e2e/visual/bookmarks-legacy.html');
    await expect(page.getByRole('heading', { name: /2 (eski kayıt korunuyor|older saved records are available)/i })).toBeVisible();
    await expect(page.locator('article')).toHaveCount(0);
    const button = page.getByRole('button', { name: /Bu hesaba aktar|Import into this account/i });
    await expect(button).toBeDisabled();
    await page.getByRole('checkbox', { name: /bana ait olduğunu doğruluyorum|I confirm these old device records belong to me/i }).check();
    await expect(button).toBeEnabled();
    await button.click();
    await expect(page.locator('article')).toHaveCount(2);
    await expect(page.getByRole('heading', { name: /2 (eski kayıt korunuyor|older saved records are available)/i })).toHaveCount(0);
    await expect(page.getByRole('button', { name: /Bu hesaba aktar|Import into this account/i })).toHaveCount(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('legacy recovery remains keyboard-operable at 200% CSS text size on 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/e2e/visual/bookmarks-legacy.html');
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  const checkbox = page.getByRole('checkbox', { name: /bana ait olduğunu doğruluyorum|I confirm these old device records belong to me/i });
  const button = page.getByRole('button', { name: /Bu hesaba aktar|Import into this account/i });
  await checkbox.focus();
  await expect(checkbox).toBeFocused();
  await page.keyboard.press('Space');
  await expect(checkbox).toBeChecked();
  await expect(button).toBeEnabled();
  await button.focus();
  await expect(button).toBeFocused();
  const before = await button.boundingBox();
  expect(before.height).toBeGreaterThanOrEqual(44);
  expect(before.x + before.width).toBeLessThanOrEqual(320);
  await page.keyboard.press('Enter');
  await expect(page.locator('article')).toHaveCount(2);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
