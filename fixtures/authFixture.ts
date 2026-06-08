/**
 * Auth Fixture
 * Provides pre-authenticated Playwright pages for each user role.
 * Tests using this fixture skip the login UI and start authenticated.
 */
import { test as base, Page } from '@playwright/test';
import {
  MOCK_ADMIN_USER,
  MOCK_PARTNER_USER,
  MOCK_ADMIN_PROFILE,
  MOCK_PARTNER_PROFILE,
  SUCCESS_LOGIN_RESPONSE,
  MOCK_PROFILE_RESPONSE,
} from '../data/mockData';
import { ROUTES } from '../constants/routes';
import { API_PATTERNS } from '../constants/apiEndpoints';
import { AuthUser, ProfileData } from '../types/auth.types';

/** Internal helper: navigate to login, mock routes, and complete sign-in */
async function loginAs(
  page: Page,
  user: AuthUser,
  profile: ProfileData,
  redirectPattern: RegExp
): Promise<void> {
  // Set up mocks before navigating
  await page.route(API_PATTERNS.AUTH_LOGIN, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(SUCCESS_LOGIN_RESPONSE(user)),
    });
  });

  await page.route(API_PATTERNS.USER_PROFILE, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_PROFILE_RESPONSE(profile)),
    });
  });

  await page.goto(ROUTES.AUTH_LOGIN);
  await page.locator('input[name="email"]').fill(user.email);
  await page.locator('input[name="password"]').fill('Admin@123');
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(redirectPattern, { timeout: 10_000 });
}

// ─── Extended Fixture Types ──────────────────────────────────────────────────

type AuthFixtures = {
  /** Page pre-authenticated as Super Admin */
  adminPage: Page;
  /** Page pre-authenticated as Service Partner */
  partnerPage: Page;
};

/** Auth fixture — extend this in test files that need pre-auth state */
export const authTest = base.extend<AuthFixtures>({
  adminPage: async ({ page }, use) => {
    await loginAs(page, MOCK_ADMIN_USER, MOCK_ADMIN_PROFILE, /\/admin\/dashboard/);
    await use(page);
    // Teardown: clear auth state after test
    await page.evaluate(() => localStorage.clear());
  },

  partnerPage: async ({ page }, use) => {
    await loginAs(page, MOCK_PARTNER_USER, MOCK_PARTNER_PROFILE, /\/partner\/dashboard/);
    await use(page);
    await page.evaluate(() => localStorage.clear());
  },
});
