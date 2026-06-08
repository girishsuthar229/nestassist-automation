/**
 * Profile Management Tests – Admin & Partner Roles
 *
 * Demonstrates:
 * - POM: LoginPage, LayoutPage, ProfilePage
 * - Hooks: beforeEach (auth setup with mocked login)
 * - Positive & negative update scenarios
 * - Role-based navigation to different profile URLs
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LayoutPage } from '../pages/LayoutPage';
import { ProfilePage } from '../pages/ProfilePage';
import { UserRole } from '../types/auth.types';
import {
  MOCK_ADMIN_USER,
  MOCK_PARTNER_USER,
  MOCK_ADMIN_PROFILE,
  MOCK_PARTNER_PROFILE,
  SUCCESS_LOGIN_RESPONSE,
  MOCK_PROFILE_RESPONSE,
  MOCK_PROFILE_UPDATE_SUCCESS,
  MOCK_ADMIN_DASHBOARD_OVERVIEW_RESPONSE,
  MOCK_PARTNER_DASHBOARD_OVERVIEW_RESPONSE,
} from '../data/mockData';
import { API_PATTERNS } from '../constants/apiEndpoints';

// ─── Helper: logs in as a given role using mocked responses ───────────────────
async function authenticateAs(
  loginPage: LoginPage,
  user: typeof MOCK_ADMIN_USER,
  profile: typeof MOCK_ADMIN_PROFILE,
  redirectPattern: RegExp
) {
  const { page } = loginPage;

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

  await page.route(API_PATTERNS.DASHBOARD_OVERVIEW, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_ADMIN_DASHBOARD_OVERVIEW_RESPONSE),
    });
  });

  await page.route(API_PATTERNS.DASHBOARD_ANALYTICS, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_PARTNER_DASHBOARD_OVERVIEW_RESPONSE),
    });
  });

  await loginPage.navigate();
  await loginPage.login(user.email, 'Admin@123');
  await page.waitForURL(redirectPattern, { timeout: 12000 });
}

// ─────────────────────────────────────────────────────────────────────────────
// Suite 1: Partner Profile
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Profile – Service Partner', () => {
  let loginPage: LoginPage;
  let layoutPage: LayoutPage;
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    layoutPage = new LayoutPage(page);
    profilePage = new ProfilePage(page);

    await authenticateAs(loginPage, MOCK_PARTNER_USER, MOCK_PARTNER_PROFILE, /\/partner\/dashboard/);
  });

  test('Partner can navigate to profile page', async ({ page }) => {
    await profilePage.navigate(UserRole.SERVICE_PARTNER);
    await page.waitForURL('**/partner/my-profile');
    await expect(page).toHaveURL(/partner\/my-profile/);
  });

  test('Partner profile displays correct name and email', async ({ page }) => {
    await profilePage.navigate(UserRole.SERVICE_PARTNER);
    await page.waitForURL('**/partner/my-profile');
    await profilePage.verifyProfileDetails({
      name: MOCK_PARTNER_PROFILE.name,
      email: MOCK_PARTNER_PROFILE.email,
      mobile: MOCK_PARTNER_PROFILE.mobile_number,
    });
  });

  test('Partner can update mobile number successfully', async ({ page }) => {
    await profilePage.navigate(UserRole.SERVICE_PARTNER);
    await page.waitForURL('**/partner/my-profile');

    const updatedMobile = '9123456789';

    await page.route(API_PATTERNS.USER_PROFILE_UPDATE, async route => {
      const payload = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PROFILE_UPDATE_SUCCESS),
      });
    });

    await profilePage.openEditModal();
    await profilePage.updateContactInfo({ mobile: updatedMobile });
    await profilePage.verifyToastMessage('updated successfully');
  });
});

test.describe('Profile – Super Admin', () => {
  let loginPage: LoginPage;
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    profilePage = new ProfilePage(page);

    await authenticateAs(loginPage, MOCK_ADMIN_USER, MOCK_ADMIN_PROFILE, /\/admin\/dashboard/);
  });

  test('Admin can navigate to profile page', async ({ page }) => {
    await profilePage.navigate(UserRole.SUPER_ADMIN);
    await page.waitForURL('**/admin/my-profile');
    await expect(page).toHaveURL(/admin\/my-profile/);
  });

  test('Admin profile displays correct name', async ({ page }) => {
    await profilePage.navigate(UserRole.SUPER_ADMIN);
    await page.waitForURL('**/admin/my-profile');
    await profilePage.verifyProfileDetails({
      name: MOCK_ADMIN_PROFILE.name,
    });
  });
});


test.describe('Profile – Partner (via route mocking)', () => {
  test('Profile page shows mocked partner data', async ({ page }) => {
    const loginPage = new LoginPage(page);

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

    await loginPage.navigate();
    await loginPage.login(MOCK_PARTNER_USER.email, 'Admin@123');
    await loginPage.waitForRedirection(UserRole.SERVICE_PARTNER);

    await expect(page).toHaveURL(/\/partner\/dashboard/);
  });
});
