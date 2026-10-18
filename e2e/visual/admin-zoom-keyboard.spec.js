import { test, expect } from '@playwright/test';

/** At 400% zoom on a 1280px window, the available CSS viewport is 320px.
 * Check native keyboard scrolling without touching the fake admin service. */
for (const { tab, selector, expectedCount } of [
  { tab: 1, selector: 'select:not(:disabled)', expectedCount: 4 },
  { tab: 2, selector: 'button[aria-label]', expectedCount: 9 },
]) {
  test(`admin table keyboard actions in tab ${tab} are unobscured at 320 CSS pixels`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/e2e/visual/admin-auth.html');
    await page.getByRole('tab').nth(tab).click();
    const region = page.locator('[class*="tableWrap"]');
    await expect(region).toBeVisible();
    await region.focus();
    const controls = region.locator(selector);
    await expect(controls).toHaveCount(expectedCount);

    for (let i = 0; i < expectedCount; i += 1) {
      await page.keyboard.press('Tab');
      await expect(controls.nth(i)).toBeFocused();
      const visibility = await controls.nth(i).evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const left = Math.max(0, rect.left);
        const right = Math.min(window.innerWidth, rect.right);
        const top = Math.max(0, rect.top);
        const bottom = Math.min(window.innerHeight, rect.bottom);
        const hit = document.elementFromPoint((left + right) / 2, (top + bottom) / 2);
        return {
          withinViewport: right > left && bottom > top,
          focusVisible: element.matches(':focus-visible'),
          unobscured: Boolean(hit && (hit === element || element.contains(hit))),
        };
      });
      expect(visibility, `tab ${tab}, control ${i}: focused control must remain visible over fixed first column`)
        .toEqual({ withinViewport: true, focusVisible: true, unobscured: true });
    }
    const horizontalOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(horizontalOverflow).toBeLessThanOrEqual(1);
  });
}
