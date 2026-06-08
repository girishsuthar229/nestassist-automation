/**
 * Mock Route Helper
 * Wraps page.route() calls for common API mocking.
 * Import this instead of copy-pasting page.route() in every test.
 */
import { Page } from '@playwright/test';
import {
  MOCK_ADMIN_USER,
  MOCK_PARTNER_USER,
  MOCK_ADMIN_PROFILE,
  MOCK_PARTNER_PROFILE,
  MOCK_CUSTOMER_PROFILE,
  SUCCESS_LOGIN_RESPONSE,
  FAILURE_LOGIN_RESPONSE,
  MOCK_PROFILE_RESPONSE,
  MOCK_FORGOT_PASSWORD_SUCCESS,
  MOCK_FORGOT_PASSWORD_NOT_FOUND,
  MOCK_RESET_PASSWORD_SUCCESS,
  MOCK_SERVICES_RESPONSE,
  MOCK_DASHBOARD_STATS_RESPONSE,
  MOCK_PROFILE_UPDATE_SUCCESS,
  MOCK_ADMIN_DASHBOARD_OVERVIEW_RESPONSE,
  MOCK_PARTNER_DASHBOARD_OVERVIEW_RESPONSE,
} from '../data/mockData';
import { API_PATTERNS } from '../constants/apiEndpoints';
import { AuthUser, ProfileData } from '../types/auth.types';

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN MOCKS
// ─────────────────────────────────────────────────────────────────────────────

/** Mock a successful login for a given user */
export async function mockLoginSuccess(page: Page, user: AuthUser): Promise<void> {
  await page.route(API_PATTERNS.AUTH_LOGIN, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(SUCCESS_LOGIN_RESPONSE(user)),
    });
  });
}

/** Mock an admin login with profile fetch and dashboard overview as a pair */
export async function mockAdminLogin(page: Page): Promise<void> {
  await mockLoginSuccess(page, MOCK_ADMIN_USER);
  await mockProfile(page, MOCK_ADMIN_PROFILE);
  await mockAdminDashboardOverview(page);
}

/** Mock a partner login with profile fetch and dashboard analytics as a pair */
export async function mockPartnerLogin(page: Page): Promise<void> {
  await mockLoginSuccess(page, MOCK_PARTNER_USER);
  await mockProfile(page, MOCK_PARTNER_PROFILE);
  await mockPartnerDashboardAnalytics(page);
}

/** Mock a failed login (401 Unauthorized) */
export async function mockLoginFailure(page: Page): Promise<void> {
  await page.route(API_PATTERNS.AUTH_LOGIN, async route => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify(FAILURE_LOGIN_RESPONSE),
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE MOCKS
// ─────────────────────────────────────────────────────────────────────────────

/** Mock the user profile fetch endpoint */
export async function mockProfile(page: Page, profile: ProfileData): Promise<void> {
  await page.route(API_PATTERNS.USER_PROFILE, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_PROFILE_RESPONSE(profile)),
    });
  });
}

/** Mock a profile update success */
export async function mockProfileUpdateSuccess(page: Page): Promise<void> {
  await page.route(API_PATTERNS.USER_PROFILE_UPDATE, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_PROFILE_UPDATE_SUCCESS),
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// FORGOT / RESET PASSWORD MOCKS
// ─────────────────────────────────────────────────────────────────────────────

/** Mock successful forgot password */
export async function mockForgotPasswordSuccess(page: Page): Promise<void> {
  await page.route(API_PATTERNS.AUTH_FORGOT_PASSWORD, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_FORGOT_PASSWORD_SUCCESS),
    });
  });
}

/** Mock forgot password – email not found */
export async function mockForgotPasswordNotFound(page: Page): Promise<void> {
  await page.route(API_PATTERNS.AUTH_FORGOT_PASSWORD, async route => {
    await route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_FORGOT_PASSWORD_NOT_FOUND),
    });
  });
}

/** Mock successful password reset */
export async function mockResetPasswordSuccess(page: Page): Promise<void> {
  await page.route(API_PATTERNS.AUTH_RESET_PASSWORD, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_RESET_PASSWORD_SUCCESS),
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES MOCKS
// ─────────────────────────────────────────────────────────────────────────────

/** Mock services list */
export async function mockServicesList(page: Page): Promise<void> {
  await page.route(API_PATTERNS.SERVICES_LIST, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_SERVICES_RESPONSE),
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD MOCKS
// ─────────────────────────────────────────────────────────────────────────────

/** Mock dashboard stats */
export async function mockDashboardStats(page: Page): Promise<void> {
  await page.route(API_PATTERNS.DASHBOARD_STATS, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_DASHBOARD_STATS_RESPONSE),
    });
  });
}

/** Mock admin dashboard overview */
export async function mockAdminDashboardOverview(page: Page): Promise<void> {
  await page.route(API_PATTERNS.DASHBOARD_OVERVIEW, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_ADMIN_DASHBOARD_OVERVIEW_RESPONSE),
    });
  });
}

/** Mock partner dashboard analytics */
export async function mockPartnerDashboardAnalytics(page: Page): Promise<void> {
  await page.route(API_PATTERNS.DASHBOARD_ANALYTICS, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_PARTNER_DASHBOARD_OVERVIEW_RESPONSE),
    });
  });
}
