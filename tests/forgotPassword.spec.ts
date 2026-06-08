/**
 * Forgot Password Tests – DDT with Mocked API
 *
 * Demonstrates:
 * - POM: ForgotPasswordPage
 * - DDT: FORGOT_PASSWORD_SCENARIOS.forEach
 * - Mock route interception
 * - Positive + negative test scenarios
 */
import { test, expect } from '@playwright/test';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import {
  MOCK_FORGOT_PASSWORD_SUCCESS,
  MOCK_FORGOT_PASSWORD_NOT_FOUND,
} from '../data/mockData';
import { FORGOT_PASSWORD_SCENARIOS } from '../data/forgotPassword';
import { API_PATTERNS } from '../constants/apiEndpoints';

test.describe('Forgot Password – All Scenarios', () => {
  let forgotPage: ForgotPasswordPage;

  test.beforeEach(async ({ page }) => {
    forgotPage = new ForgotPasswordPage(page);
    await forgotPage.navigate();
  });

  test('Registered email – shows success message after submission', async ({ page }) => {
    await page.route(API_PATTERNS.AUTH_FORGOT_PASSWORD, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_FORGOT_PASSWORD_SUCCESS),
      });
    });

    // ACT
    await forgotPage.submitForgotPassword('admin-homecare2@yopmail.com');
    // ASSERT
    await forgotPage.assertSuccessMessageVisible(MOCK_FORGOT_PASSWORD_SUCCESS.message);
  });

  // ─── DDT: Run all scenarios from data file ────────────────────────────────
  test.describe('DDT – Forgot Password Scenarios', () => {
    for (const scenario of FORGOT_PASSWORD_SCENARIOS) {
      test(`[${scenario.shouldSucceed ? 'POSITIVE' : 'NEGATIVE'}] ${scenario.label}`, async ({ page }) => {
        const forgotPageDdt = new ForgotPasswordPage(page);
        await forgotPageDdt.navigate();

        let apiCalled = false;
        await page.route(API_PATTERNS.AUTH_FORGOT_PASSWORD, async route => {
          apiCalled = true;
          if (scenario.mockStatus !== 0) {
            await route.fulfill({
              status: scenario.mockStatus,
              contentType: 'application/json',
              body: JSON.stringify(
                scenario.shouldSucceed 
                ? MOCK_FORGOT_PASSWORD_SUCCESS 
                : (scenario.mockStatus === 404 
                  ? MOCK_FORGOT_PASSWORD_NOT_FOUND 
                  : { success: false, message: scenario.expectedMessage })
              ),
            });
          } else {
            await route.continue();
          }
        });

        // ACT
        if (scenario.email === '') {
          await forgotPageDdt.submit();
        } else {
          await forgotPageDdt.submitForgotPassword(scenario.email);
        }

        // ASSERT
        if (scenario.shouldSucceed) {
          await forgotPageDdt.assertSuccessMessageVisible(scenario.expectedMessage);
          expect(apiCalled).toBe(true);
        } else {
          if (scenario.mockStatus === 0) {
            await expect(page).toHaveURL(/forgot-password/);
            expect(apiCalled).toBe(false);
          } else {
            await forgotPageDdt.assertErrorMessageVisible();
            expect(apiCalled).toBe(true);
          }
        }
      });
    }
  });


  test('Back to login link navigates to login page', async ({ page }) => {
    await forgotPage.clickBackToLogin();
    await expect(page).toHaveURL(/(login|auth\/login)/);
  });
});
