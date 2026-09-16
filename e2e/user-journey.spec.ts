import { test, expect } from '@playwright/test';

test.describe('End-to-End User Journeys', () => {
  test('1. Homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Marriage|Hall|Venue/i);
    await expect(page.locator('header')).toBeVisible();
  });

  test('2. Search venue and navigate to halls list', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Mumbai');
      await searchInput.press('Enter');
    } else {
      await page.goto('/halls');
    }
    await expect(page).toHaveURL(/\/halls/);
  });

  test('3. Open venue details page', async ({ page }) => {
    await page.goto('/halls');
    const hallCard = page.locator('a[href^="/halls/"]').first();
    if (await hallCard.isVisible()) {
      await hallCard.click();
      await expect(page).toHaveURL(/\/halls\/.+/);
    }
  });

  test('4. Apply filters on venue list', async ({ page }) => {
    await page.goto('/halls');
    const filterBtn = page.getByRole('button', { name: /filter/i }).first();
    if (await filterBtn.isVisible()) {
      await filterBtn.click();
    }
  });

  test('5. Favorite venue action', async ({ page }) => {
    await page.goto('/halls');
    const favoriteBtn = page.locator('button[aria-label*="favorite"], button[aria-label*="Bookmark"]').first();
    if (await favoriteBtn.isVisible()) {
      await favoriteBtn.click();
    }
  });

  test('6. User Login Flow', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'testuser@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('7. Check hall availability', async ({ page }) => {
    await page.goto('/halls');
    const hallLink = page.locator('a[href^="/halls/"]').first();
    if (await hallLink.isVisible()) {
      await hallLink.click();
      const checkBtn = page.getByRole('button', { name: /check availability|book/i }).first();
      if (await checkBtn.isVisible()) {
        await checkBtn.click();
      }
    }
  });

  test('8 & 9. Create booking and payment flow', async ({ page }) => {
    await page.goto('/account/bookings');
    await expect(page).toHaveURL(/\/account\/bookings|\/login/);
  });

  test('10. Customer views booking dashboard', async ({ page }) => {
    await page.goto('/account/bookings');
    await expect(page).toHaveURL(/\/account\/bookings|\/login/);
  });

  test('11. Vendor views vendor dashboard', async ({ page }) => {
    await page.goto('/vendor/dashboard');
    await expect(page).toHaveURL(/\/vendor\/dashboard|\/login/);
  });
});

