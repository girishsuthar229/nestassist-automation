/**
 * ForgotPasswordPage – Page Object Model
 * Covers /auth/forgot-password and /auth/reset-password flows.
 */
import { Page, Locator, expect } from '@playwright/test';
import { ROUTES } from '../constants/routes';

export class ForgotPasswordPage {
  readonly page: Page;

  //Forgot Password Form
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly backToLoginLink: Locator;

  //Reset Password Form
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly resetSubmitButton: Locator;
  readonly resetSuccessMessage: Locator;
  readonly resetErrorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.locator('input[name="email"], input[type="email"]').first();
    this.submitButton = page.locator('button[type="submit"]');
    this.successMessage = page.locator(
      'p[class*="success"], div[class*="success"], [class*="alert-success"], p:has-text("sent"), div:has-text("reset link")'
    ).first();
    this.errorMessage = page.locator(
      'p[class*="error"], span[class*="error"], div[role="alert"], p.text-red-500, p.text-red-700, .text-red-500, .text-red-700'
    ).first();
    this.backToLoginLink = page.locator('a, button').filter({ hasText: /Back to Login|Login/i });

    this.newPasswordInput = page.locator('input[name="newPassword"], input[name="password"]').first();
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"], input[name="confirm_password"]').first();
    this.resetSubmitButton = page.locator('button[type="submit"]');
    this.resetSuccessMessage = page.locator('p:has-text("reset"), div:has-text("successfully")').first();
    this.resetErrorMessage = page.locator('p[class*="error"], div[role="alert"]').first();
  }

  async navigate(): Promise<void> {
    await this.page.goto(ROUTES.AUTH_FORGOT_PASSWORD);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async submit(): Promise<void> {
    await this.submitButton.click({ force: true });
  }

  async submitForgotPassword(email: string): Promise<void> {
    await this.fillEmail(email);
    await this.submit();
  }

  async assertSuccessMessageVisible(expectedText?: string): Promise<void> {
    await expect(this.successMessage).toBeVisible({ timeout: 8000 });
    if (expectedText) {
      await expect(this.successMessage).toContainText(expectedText, { ignoreCase: true });
    }
  }

  async assertErrorMessageVisible(expectedText?: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    if (expectedText) {
      await expect(this.errorMessage).toContainText(expectedText, { ignoreCase: true });
    }
  }

  async clickBackToLogin(): Promise<void> {
    await this.backToLoginLink.first().click();
    await this.page.waitForURL(/\/(login|auth\/login)/);
  }

  async navigateToReset(token: string): Promise<void> {
    await this.page.goto(`${ROUTES.AUTH_RESET_PASSWORD}/${token}`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillResetForm(newPassword: string, confirmPassword?: string): Promise<void> {
    await this.newPasswordInput.fill(newPassword);
    if (confirmPassword !== undefined) {
      await this.confirmPasswordInput.fill(confirmPassword);
    }
  }

  async submitReset(): Promise<void> {
    await this.resetSubmitButton.click();
  }

  async assertResetSuccessVisible(): Promise<void> {
    await expect(this.resetSuccessMessage).toBeVisible({ timeout: 8000 });
  }

  async assertResetErrorVisible(expectedText?: string): Promise<void> {
    await expect(this.resetErrorMessage).toBeVisible({ timeout: 5000 });
    if (expectedText) {
      await expect(this.resetErrorMessage).toContainText(expectedText, { ignoreCase: true });
    }
  }
}
