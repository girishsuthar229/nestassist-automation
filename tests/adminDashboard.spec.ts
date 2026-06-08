/**
 * Admin Dashboard Tests – Role-Based Access Control & UI
 *
 * Demonstrates:
 * - POM: AdminDashboardPage, LoginPage
 * - Auth fixtures (pre-login setup with mocked API)
 * - Role-based access: Admin can access dashboard
 * - Authorization guard: Partner & unauthenticated user cannot access admin dashboard
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import {
  MOCK_ADMIN_USER,
  MOCK_PARTNER_USER,
  MOCK_ADMIN_PROFILE,
  MOCK_PARTNER_PROFILE,
  SUCCESS_LOGIN_RESPONSE,
  MOCK_PROFILE_RESPONSE,
  MOCK_ADMIN_DASHBOARD_OVERVIEW_RESPONSE,
} from '../data/mockData';
import { API_PATTERNS } from '../constants/apiEndpoints';
import { ROUTES } from '../constants/routes';

// ─────────────────────────────────────────────────────────────────────────────
// Suite 1: Admin Access – Positive
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Admin Dashboard – Authenticated Admin Access', () => {
  test.beforeEach(async ({ page }) => {
    // Pre-authenticate as admin
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

    await page.route(API_PATTERNS.DASHBOARD_OVERVIEW, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_ADMIN_DASHBOARD_OVERVIEW_RESPONSE),
      });
    });

    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(MOCK_ADMIN_USER.email, 'Admin@123');
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 12000 });
  });

  test('Admin can view the dashboard heading', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);
    await dashboardPage.assertDashboardVisible();
  });

  test('Admin dashboard URL is /admin/dashboard', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  test('Admin dashboard shows sidebar navigation', async ({ page }) => {
    const dashboardPage = new AdminDashboardPage(page);
    await dashboardPage.assertSidebarVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 2: Authorization Guard – Negative
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Admin Dashboard – Authorization Guard', () => {
  test('Unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto(ROUTES.ADMIN_DASHBOARD);
    await expect(page).toHaveURL(/(login|auth\/login)/);
  });

  test('Service Partner is redirected away from admin dashboard', async ({ page }) => {
    // Login as partner
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

    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(MOCK_PARTNER_USER.email, 'Admin@123');
    await page.waitForURL(/\/partner\/dashboard/, { timeout: 12000 });

    // Try to access admin route
    await page.goto(ROUTES.ADMIN_DASHBOARD);
    // Should be redirected away (not stay on admin dashboard)
    await expect(page).not.toHaveURL(/\/admin\/dashboard/);
  });
});
