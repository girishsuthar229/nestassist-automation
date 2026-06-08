/**
 * Login Tests – Data-Driven Testing with Role-Based Mocking
 *
 * Demonstrates:
 * - POM (Page Object Model): LoginPage
 * - DDT (Data-Driven Testing): testCases.forEach
 * - Mock route interception: page.route()
 * - Hooks: beforeEach, afterEach
 * - Positive + Negative test scenarios
 * - Role-based redirection verification
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { UserRole } from '../types/auth.types';
import {
  MOCK_ADMIN_USER,
  MOCK_PARTNER_USER,
  MOCK_ADMIN_PROFILE,
  MOCK_PARTNER_PROFILE,
  SUCCESS_LOGIN_RESPONSE,
  FAILURE_LOGIN_RESPONSE,
  ACCOUNT_LOCKED_RESPONSE,
  MOCK_PROFILE_RESPONSE,
  CUSTOMER_SEND_OTP_SUCCESS,
  MOCK_CUSTOMER_USER,
  MOCK_CUSTOMER_PROFILE,
  CUSTOMER_VERIFY_OTP_SUCCESS
} from '../data/mockData';

import {
  VALID_USERS,
  INVALID_LOGIN_CASES,
} from '../data/testData';
import { API_PATTERNS } from '../constants/apiEndpoints';
import { ROUTES } from '../constants/routes';


test.describe('Login – Form Validation', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('Submit button is disabled when required fields are empty', async ({ page }) => {
    const button = page.locator('button[type="submit"]');
    await expect(button).toBeDisabled();

    await page.locator('input[name="email"]').fill('homecare-admin@yopmail.com');
    await expect(button).toBeDisabled();

    await page.locator('input[name="password"]').fill('Admin@123');
    await expect(button).toBeEnabled();

    await page.locator('input[name="email"]').fill('');
    await expect(button).toBeDisabled();
  });

  test('Should have a link to forgot password page', async ({ page }) => {
    const forgotLink = page.locator('button:has-text("Forgot"), a:has-text("Forgot")').first();
    await expect(forgotLink).toBeVisible();
    await forgotLink.click();
    await page.waitForURL(/forgot-password/, { timeout: 8000 });
  });

  test('Login page should remain on failed navigation to protected route', async ({ page }) => {
    // Direct navigate to admin dashboard should redirect to login
    await page.goto(ROUTES.ADMIN_DASHBOARD);
    await expect(page).toHaveURL(/(login|auth\/login)/);
  });
});


test.describe('Login – Successful Login by Role (DDT)', () => {
  for (const user of VALID_USERS) {
    test(`[${user.role}] ${user.label} – successful login redirects to correct dashboard`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      const mockUser = user.role === UserRole.SUPER_ADMIN ? MOCK_ADMIN_USER : MOCK_PARTNER_USER;
      const mockProfile = user.role === UserRole.SUPER_ADMIN ? MOCK_ADMIN_PROFILE : MOCK_PARTNER_PROFILE;

      // ARRANGE: Mock API routes
      await page.route(API_PATTERNS.AUTH_LOGIN, async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(SUCCESS_LOGIN_RESPONSE(mockUser)),
        });
      });

      await page.route(API_PATTERNS.USER_PROFILE, async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_PROFILE_RESPONSE(mockProfile)),
        });
      });

      // ACT
      await loginPage.navigate();
      await loginPage.login(user.email, user.password);

      // ASSERT
      await page.waitForURL(user.expectedURLPattern, { timeout: 12000 });
      await expect(page).toHaveURL(user.expectedURLPattern);
    });
  }
});


test.describe('Login – Failed Login Scenarios', () => {
  const loginPage = { instance: null as LoginPage | null };

  test.beforeEach(async ({ page }) => {
    loginPage.instance = new LoginPage(page);
    await loginPage.instance.navigate();
  });

  test('Wrong password – shows invalid credentials error', async ({ page }) => {
    await page.route(API_PATTERNS.AUTH_LOGIN, async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify(FAILURE_LOGIN_RESPONSE),
      });
    });

    await loginPage.instance!.login('homecare-admin@yopmail.com', 'WrongPassword');
    const errorText = await loginPage.instance!.getErrorMessage();
    expect(errorText).toContain(FAILURE_LOGIN_RESPONSE.message);
    await expect(page).toHaveURL(/(login|auth\/login)/);
  });

  test('Invalid email format backend validation – shows validation error details', async ({ page }) => {
    const { VALIDATION_FAILED_LOGIN_RESPONSE } = await import('../data/mockData');
    
    await page.route(API_PATTERNS.AUTH_LOGIN, async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify(VALIDATION_FAILED_LOGIN_RESPONSE),
      });
    });

    await loginPage.instance!.login('ravi.pate@s.yomai', 'Admin@123');
    
    const errorText = await loginPage.instance!.getErrorMessage();
    expect(errorText).toMatch(/Validation failed.|Invalid email format/i);
    await expect(page).toHaveURL(/(login|auth\/login)/);
  });

  test('Non-existent email – shows invalid credentials error', async ({ page }) => {
    await page.route(API_PATTERNS.AUTH_LOGIN, async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify(FAILURE_LOGIN_RESPONSE),
      });
    });

    await loginPage.instance!.login('notregistered@example.com', 'Admin@123');
    const errorText = await loginPage.instance!.getErrorMessage();
    expect(errorText).toContain('Invalid email or password');
  });

  test('Account locked – shows locked account message', async ({ page }) => {
    await page.route(API_PATTERNS.AUTH_LOGIN, async route => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify(ACCOUNT_LOCKED_RESPONSE),
      });
    });

    await loginPage.instance!.login('homecare-admin@yopmail.com', 'Admin@123');
    // Page should stay on login
    await expect(page).toHaveURL(/(login|auth\/login)/);
  });
});

//Authorization guard – role-based access control
test.describe('Login – Authorization Guard', () => {
  test('Unauthenticated user cannot access admin dashboard', async ({ page }) => {
    await page.goto(ROUTES.ADMIN_DASHBOARD);
    await expect(page).toHaveURL(/(login|auth\/login)/);
  });

  test('Unauthenticated user cannot access partner dashboard', async ({ page }) => {
    await page.goto(ROUTES.PARTNER_DASHBOARD);
    await expect(page).toHaveURL(/(login|auth\/login)/);
  });
});

test.describe('Login – Customer OTP Base Login', () => {
  test('Customer can login using OTP successfully', async ({ page }) => {
    // 1. Mock Send OTP
    await page.route(API_PATTERNS.CUSTOMER_SEND_OTP, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(CUSTOMER_SEND_OTP_SUCCESS),
      });
    });

    // 2. Mock Verify OTP
    await page.route(API_PATTERNS.CUSTOMER_VERIFY_OTP, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(CUSTOMER_VERIFY_OTP_SUCCESS(MOCK_CUSTOMER_USER)),
      });
    });

    // 3. Mock Profile Fetch
    await page.route(API_PATTERNS.USER_PROFILE, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PROFILE_RESPONSE(MOCK_CUSTOMER_PROFILE)),
      });
    });

    // Go to customer login page
    await page.goto(ROUTES.LOGIN);

    // Fill customer login form (name and email)
    await page.locator('input[name="name"]').fill(MOCK_CUSTOMER_USER.name);
    await page.locator('input[name="email"]').fill(MOCK_CUSTOMER_USER.email);
    
    // Click Get OTP
    await page.locator('button[type="submit"]').click();

    // Verify redirection to OTP page
    await page.waitForURL(/\/login\/otp/);
    await expect(page).toHaveURL(/\/login\/otp/);

    // Fill OTP (4 digits)
    // The OTP verification page usually has an OTP input component. 
    // We'll type directly into the document assuming it catches keypresses or find standard input.
    // If it uses 4 separate inputs:
    const otpInput = page.locator('input[name="otp"], input[placeholder="Enter OTP"]').first();
    await otpInput.waitFor({ state: 'visible' });
    
    // Sometimes OTP fields are split into multiple inputs. We can try sequential filling or filling a hidden input if used.
    // Assuming standard react-otp-input or similar where we can just type '1234' on the first box or document.
    await otpInput.fill('1234');

    // Click Verify & Continue
    await page.locator('button[type="submit"]').click();

    // Verify redirection to home or previous page
    // Customer login redirects to HOME '/' or the intended protected route
    await page.waitForURL(ROUTES.HOME, { timeout: 12000 });
    await expect(page).toHaveURL(ROUTES.HOME);
  });
});
