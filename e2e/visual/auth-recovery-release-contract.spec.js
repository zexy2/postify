import { expect, test } from '@playwright/test';

// Safe local validation only: invalid forms must never submit or contact an auth provider.
// These are functional gates independent from owner-unreviewed auth screenshot goldens.
const cases = [
  { slug: 'login', firstInvalid: '#email', password: '#password' },
  { slug: 'register', firstInvalid: '#fullName', password: '#password' },
  { slug: 'forgot-password', firstInvalid: '#recovery-email' },
  { slug: 'reset-password', firstInvalid: '#new-password', password: '#new-password' },
];
for (const { slug, firstInvalid, password } of cases) {
  for (const width of [320, 390, 1440]) {
    test(`Auth /${slug} at ${width}px: errors, focus, and recovery remain accessible`, async ({ page }) => {
      const isDark = width === 390;
      await page.setViewportSize({ width, height: 820 });
      await page.addInitScript((theme) => {
        localStorage.setItem('postify_theme', theme);
        localStorage.setItem('postify_language', 'en');
      }, isDark ? 'dark' : 'light');
      await page.goto(`/auth/${slug}`);
      const form = page.locator('main form').first();
      const submit = form.locator('button[type="submit"]');
      const target = form.locator(firstInvalid);
      await expect(target).toBeVisible();
      await expect(submit).toBeEnabled();
      expect((await submit.boundingBox())?.height).toBeGreaterThanOrEqual(44);
      if (password) {
        await expect(form.locator(password)).toHaveAttribute('type', 'password');
        const show = form.getByRole('button', { name: /show password/i });
        expect((await show.boundingBox())?.height).toBeGreaterThanOrEqual(44);
        await show.click();
        await expect(form.locator(password)).toHaveAttribute('type', 'text');
        await form.getByRole('button', { name: /hide password/i }).click();
        await expect(form.locator(password)).toHaveAttribute('type', 'password');
      }
      await submit.click();
      await expect(target).toBeFocused();
      await expect(target).toHaveAttribute('aria-invalid', 'true');
      const description = await target.getAttribute('aria-describedby');
      expect(description).toBeTruthy();
      await expect(page.locator(`#${description}`)).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      if (slug.endsWith('password')) {
        const back = page.getByRole('link', { name: /back to sign in/i });
        await expect(back).toBeVisible();
        const rect = await back.boundingBox();
        expect(rect?.height, 'Recovery sign-in link should meet 44px touch target').toBeGreaterThanOrEqual(44);
      }
    });
  }
}
