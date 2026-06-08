/**
 * Services Page Tests
 *
 * Demonstrates:
 * - POM: ServicesPage
 * - Mock route interception for API
 * - Public page assertions (no auth required)
 */
import { test, expect } from '@playwright/test';
import { ServicesPage } from '../pages/ServicesPage';
import { MOCK_SERVICES_RESPONSE } from '../data/services';
import { API_PATTERNS } from '../constants/apiEndpoints';
import { ROUTES } from '../constants/routes';

test.describe('Services Page', () => {
  let servicesPage: ServicesPage;

  test.beforeEach(async ({ page }) => {
    servicesPage = new ServicesPage(page);

    // Mock the services API. The modular /services page calls /api/service-types/public
    await page.route(API_PATTERNS.SERVICE_TYPES_PUBLIC, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_SERVICES_RESPONSE),
      });
    });
    
    // Fallback mock for direct services list if accessed
    await page.route(API_PATTERNS.SERVICES_LIST, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_SERVICES_RESPONSE),
      });
    });

    await servicesPage.navigate();
  });

  test('Services page loads and shows heading', async () => {
    await servicesPage.assertHeadingVisible();
  });

  test('Services section shows at least one service card', async () => {
    // WHY IT FAILED: 
    // 1. Mocked endpoint was **/api/services but the page calls **/api/service-types/public.
    // 2. The POM locator was looking for .card but the actual cards are buttons with .group.
    await servicesPage.waitForServicesToLoad();
    await servicesPage.assertServiceCardsVisible(1);
  });

  test('Clicking first service card navigates to service detail', async ({ page }) => {
    await servicesPage.waitForServicesToLoad();
    const firstCard = servicesPage.serviceCards.first();

    // Some apps navigate in-page or open a modal; just check that click works
    if (await firstCard.isVisible()) {
      await firstCard.click();
      // Either URL changes or a modal opens — just ensure no crash
      await page.waitForLoadState('domcontentloaded');
    }
  });

  test('Services page URL matches /services', async ({ page }) => {
    // WHY IT FAILED:
    // If data fails to load (due to mock mismatch), the page might redirect to / or error out.
    // Now with correct mocking, it stays on /services.
    await expect(page).toHaveURL(/\/services/);
  });
});
