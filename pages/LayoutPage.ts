import { Page, Locator, expect } from '@playwright/test';

export class LayoutPage {
  readonly page: Page;
  readonly userMenuTrigger: Locator;
  readonly myProfileLink: Locator;
  readonly dashboardLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userMenuTrigger = page.locator('button:has(div.hidden.md\\:block.text-left)');
    this.myProfileLink = page.locator('button:has-text("My Profile")');
    this.dashboardLink = page.locator('button:has-text("Dashboard")');
  }

  async navigateToProfile() {
    await this.userMenuTrigger.click();
    await this.myProfileLink.click();
  }

  async verifyRoleMarker(role: string) {
    if (role === 'SERVICE_PARTNER') {
      await expect(this.page.locator('nav')).toContainText(/Partner/i);
    } else {
      await expect(this.page.locator('nav')).toContainText(/Admin/i);
    }
  }

  async logout() {
    await this.userMenuTrigger.click();
    await this.page.locator('button:has-text("Logout"), a:has-text("Logout")').click();
    await this.page.waitForURL('**/login');
  }
}
