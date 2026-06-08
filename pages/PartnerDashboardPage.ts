/**
 * PartnerDashboardPage – Page Object Model
 * Covers the service partner dashboard (/partner/dashboard).
 */
import { Page, Locator, expect } from '@playwright/test';
import { ROUTES } from '../constants/routes';

export class PartnerDashboardPage {
  readonly page: Page;

  readonly heading: Locator;
  readonly sidebar: Locator;
  readonly statsCards: Locator;
  readonly activeBookingsStat: Locator;
  readonly completedBookingsStat: Locator;
  readonly earningsStat: Locator;
  readonly recentBookingsTable: Locator;

  // Sidebar nav
  readonly sidebarServiceManagementLink: Locator;
  readonly sidebarProfileLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.locator('h1, h2').filter({ hasText: /Dashboard/i }).first();
    this.sidebar = page.locator('aside, nav[class*="sidebar"]').first();
    this.statsCards = page.locator('article');
    this.activeBookingsStat = page.locator('article:has-text("Active")').first();
    this.completedBookingsStat = page.locator('article:has-text("Completed")').first();
    this.earningsStat = page.locator('article:has-text("Earning"), article:has-text("Revenue")').first();
    this.recentBookingsTable = page.locator('table, [class*="table"]').first();

    this.sidebarServiceManagementLink = page.locator('a[href*="/partner/service-management"]').first();
    this.sidebarProfileLink = page.locator('a[href*="/partner/my-profile"]').first();
  }

  async navigate(): Promise<void> {
    await this.page.goto(ROUTES.PARTNER_DASHBOARD);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async assertDashboardVisible(): Promise<void> {
    await expect(this.heading).toBeVisible({ timeout: 10000 });
  }

  async assertSidebarVisible(): Promise<void> {
    await expect(this.sidebar).toBeVisible();
  }

  async navigateToServiceManagement(): Promise<void> {
    await this.sidebarServiceManagementLink.click();
    await this.page.waitForURL('**/partner/service-management');
  }

  async navigateToProfile(): Promise<void> {
    const userMenuTrigger = this.page.locator('button:has(div.hidden.md\\:block.text-left), button:has(img[alt="User avatar"])').first();
    await userMenuTrigger.click();
    const myProfileLink = this.page.locator('a[href*="my-profile"], button:has-text("My Profile")').first();
    await myProfileLink.click();
    await this.page.waitForURL('**/partner/my-profile');
  }
}
