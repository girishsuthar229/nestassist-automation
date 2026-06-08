import { Page, Locator, expect } from '@playwright/test';
import { UserRole, AuthResponse } from '../types/auth.types';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('p.text-red-700, p.text-red-500, p[class*="error"]').first(); // Flexible selector for errors
  }

  async navigate() {
    await this.page.goto('/auth/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    return this.errorMessage.textContent();
  }

  async waitForRedirection(role: UserRole | string) {
    if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
      await this.page.waitForURL(url => url.pathname.includes('/admin/dashboard'), { timeout: 10000 });
      await expect(this.page.locator('h1').filter({ hasText: 'Dashboard' })).toBeVisible();
    } else if (role === UserRole.SERVICE_PARTNER) {
      await this.page.waitForURL(url => url.pathname.includes('/partner/dashboard'), { timeout: 10000 });
      await expect(this.page.locator('h1').filter({ hasText: 'Dashboard' })).toBeVisible();
    } else {
      await this.page.waitForURL('**/dashboard', { timeout: 10000 });
    }
  }

  async waitForLoginResponse(): Promise<AuthResponse> {
    const response = await this.page.waitForResponse(res => 
      res.url().includes('/auth/login') && res.request().method() === 'POST'
    );
    return await response.json() as AuthResponse;
  }
}
