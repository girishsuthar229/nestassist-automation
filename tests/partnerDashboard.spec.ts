/**
 * Partner Dashboard Tests
 *
 * Demonstrates:
 * - POM: PartnerDashboardPage, LoginPage
 * - Mock API setup as beforeAll/beforeEach hooks
 * - Role-based access: Partner can access their dashboard
 * - Authorization guard: Admin is redirected from partner dashboard
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PartnerDashboardPage } from '../pages/PartnerDashboardPage';
import {
  MOCK_ADMIN_USER,
  MOCK_PARTNER_USER,
  MOCK_ADMIN_PROFILE,
  MOCK_PARTNER_PROFILE,
  SUCCESS_LOGIN_RESPONSE,
  MOCK_PROFILE_RESPONSE,
  MOCK_PARTNER_DASHBOARD_OVERVIEW_RESPONSE,
} from '../data/mockData';
import { API_PATTERNS } from '../constants/apiEndpoints';
import { ROUTES } from '../constants/routes';
import { test as customTest } from '@fixtures/index';

// ─────────────────────────────────────────────────────────────────────────────
// Suite 1: Partner Access – Positive
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Partner Dashboard – Authenticated Partner Access', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(API_PATTERNS.AUTH_LOGIN, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(SUCCESS_LOGIN_RESPONSE(MOCK_PARTNER_USER)),
      });
    });

    await page.route(API_PATTERNS.USER_PROFILE, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PROFILE_RESPONSE(MOCK_PARTNER_PROFILE)),
      });
    });

    await page.route(API_PATTERNS.DASHBOARD_ANALYTICS, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PARTNER_DASHBOARD_OVERVIEW_RESPONSE),
      });
    });

    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(MOCK_PARTNER_USER.email, 'Admin@123');
    await page.waitForURL(/\/partner\/dashboard/, { timeout: 12000 });
  });

  test('Partner can view the dashboard', async ({ page }) => {
    const dashboard = new PartnerDashboardPage(page);
    await dashboard.assertDashboardVisible();
  });

  test('Partner dashboard URL is /partner/dashboard', async ({ page }) => {
    await expect(page).toHaveURL(/\/partner\/dashboard/);
  });

  test('Partner dashboard shows sidebar', async ({ page }) => {
    const dashboard = new PartnerDashboardPage(page);
    await dashboard.assertSidebarVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 2: Authorization Guard – Negative
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Partner Dashboard – Authorization Guard', () => {
  test('Unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto(ROUTES.PARTNER_DASHBOARD);
    await expect(page).toHaveURL(/(login|auth\/login)/);
  });

  test('Admin is redirected away from partner dashboard', async ({ page }) => {
    // Login as admin
    await page.route(API_PATTERNS.AUTH_LOGIN, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(SUCCESS_LOGIN_RESPONSE(MOCK_ADMIN_USER)),
      });
    });
    await page.route(API_PATTERNS.USER_PROFILE, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PROFILE_RESPONSE(MOCK_ADMIN_PROFILE)),
      });
    });

    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(MOCK_ADMIN_USER.email, 'Admin@123');
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 12000 });

    // Try to access partner route
    await page.goto(ROUTES.PARTNER_DASHBOARD);
    await expect(page).not.toHaveURL(/\/partner\/dashboard/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 3: Custom Fixture – partnerPage (pre-authenticated partner)
//
// How it works:
//   `customTest` = mergeTests(authTest, mockTest) from @fixtures/index
//   - `partnerPage` fixture (authFixture.ts) automatically:
//       1. Mocks AUTH_LOGIN → SUCCESS_LOGIN_RESPONSE(MOCK_PARTNER_USER)
//       2. Mocks USER_PROFILE → MOCK_PROFILE_RESPONSE(MOCK_PARTNER_PROFILE)
//       3. Navigates to /auth/login, fills email + password, clicks submit
//       4. Waits for redirect to /partner/dashboard
//       5. Provides the authenticated Page to the test
//       6. Clears localStorage on teardown
//   - `mock` fixture (mockFixture.ts) gives helper methods for extra mocks
//
// These tests verify the fixture works correctly — no manual login needed.
// ─────────────────────────────────────────────────────────────────────────────
customTest.describe('Custom Fixture – Partner Dashboard Verification', () => {

  customTest('partnerPage fixture lands on /partner/dashboard', async ({ partnerPage }) => {
    // The authFixture already logged in and redirected — just verify the URL
    await expect(partnerPage).toHaveURL(/\/partner\/dashboard/);
  });

  customTest('Partner dashboard heading is visible via fixture', async ({ partnerPage }) => {
    const dashboard = new PartnerDashboardPage(partnerPage);
    await dashboard.assertDashboardVisible();
  });

  customTest('Partner sidebar is rendered via fixture', async ({ partnerPage }) => {
    const dashboard = new PartnerDashboardPage(partnerPage);
    await dashboard.assertSidebarVisible();
  });

  customTest('Partner KPI cards are displayed with mock data', async ({ partnerPage, mock }) => {
    const dashboard = new PartnerDashboardPage(partnerPage);
    await mock.partnerDashboardAnalytics();
    await partnerPage.reload(); // Reload to fetch with new mock
    
    // The fixture pre-authenticates so KPI cards from the mock should render
    await expect(dashboard.statsCards.first()).toBeVisible({ timeout: 10_000 });
    // Verify at least one expected KPI value from MOCK_PARTNER_DASHBOARD_OVERVIEW_RESPONSE
    await expect(partnerPage.locator('text=₹120k').first()).toBeVisible();
  });

  customTest('Partner can navigate to Service Management via sidebar', async ({ partnerPage }) => {
    const dashboard = new PartnerDashboardPage(partnerPage);
    await dashboard.assertSidebarVisible();
    await dashboard.navigateToServiceManagement();
    await expect(partnerPage).toHaveURL(/\/partner\/service-management/);
  });

  customTest('Partner can navigate to Profile via sidebar', async ({ partnerPage }) => {
    const dashboard = new PartnerDashboardPage(partnerPage);
    await dashboard.assertSidebarVisible();
    await dashboard.navigateToProfile();
    await expect(partnerPage).toHaveURL(/\/partner\/my-profile/);
  });

  customTest('mock fixture can layer additional mocks on partnerPage', async ({ partnerPage, mock }) => {
    // Demonstrate that the mock fixture works alongside partnerPage
    // Add extra mock for services list on the already-authenticated page
    await mock.servicesList();
    await partnerPage.goto(ROUTES.PARTNER_SERVICE_MANAGEMENT);
    // Just verify the page navigated — services mock is now active
    await expect(partnerPage).toHaveURL(/\/partner\/service-management/);
  });
});
