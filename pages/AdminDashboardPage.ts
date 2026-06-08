/**
 * AdminDashboardPage – Page Object Model
 * Covers the admin dashboard (/admin/dashboard).
 */
import { Page, Locator, expect } from '@playwright/test';
import { ROUTES } from '../constants/routes';

export class AdminDashboardPage {
  readonly page: Page;

  readonly heading: Locator;
  readonly sidebar: Locator;
  readonly statsCards: Locator;
  readonly totalCustomersStat: Locator;
  readonly totalPartnersStat: Locator;
  readonly totalBookingsStat: Locator;
  readonly totalRevenueStat: Locator;
  readonly recentBookingsTable: Locator;
  readonly userMenuTrigger: Locator;

  // Sidebar navigation links
  readonly sidebarServiceManagementLink: Locator;
  readonly sidebarCustomerManagementLink: Locator;
  readonly sidebarPartnerManagementLink: Locator;
  readonly sidebarBookingManagementLink: Locator;
  readonly sidebarOffersLink: Locator;
  readonly sidebarPaymentsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1, h2').filter({ hasText: /Dashboard/i }).first();
    this.sidebar = page.locator('aside, nav[class*="sidebar"]').first();
    this.statsCards = page.locator('article');
    this.totalCustomersStat = page.locator('article:has-text("Customer")').first();
    this.totalPartnersStat = page.locator('article:has-text("Partner")').first();
    this.totalBookingsStat = page.locator('article:has-text("Booking")').first();
    this.totalRevenueStat = page.locator('article:has-text("Revenue")').first();
    this.recentBookingsTable = page.locator('table, [class*="table"]').first();
    this.userMenuTrigger = page.locator('button:has(div.hidden.md\\:block.text-left)');

    // Sidebar nav
    this.sidebarServiceManagementLink = page.locator('a[href*="/admin/service-management"]').first();
    this.sidebarCustomerManagementLink = page.locator('a[href*="/admin/user-management/customers"]').first();
    this.sidebarPartnerManagementLink = page.locator('a[href*="/admin/user-management/service-partners"]').first();
    this.sidebarBookingManagementLink = page.locator('a[href*="/admin/booking-management"]').first();
    this.sidebarOffersLink = page.locator('a[href*="/admin/offers"]').first();
    this.sidebarPaymentsLink = page.locator('a[href*="/admin/payments"]').first();
  }

  async navigate(): Promise<void> {
    await this.page.goto(ROUTES.ADMIN_DASHBOARD);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async assertDashboardVisible(): Promise<void> {
    await expect(this.heading).toBeVisible({ timeout: 50000 });
  }

  async assertSidebarVisible(): Promise<void> {
    await expect(this.sidebar).toBeVisible();
  }

  async assertStatsCardsVisible(): Promise<void> {
    await expect(this.statsCards.first()).toBeVisible({ timeout: 8000 });
  }

  async navigateToServiceManagement(): Promise<void> {
    await this.sidebarServiceManagementLink.click();
    await this.page.waitForURL('**/admin/service-management');
  }

  async navigateToCustomerManagement(): Promise<void> {
    await this.sidebarCustomerManagementLink.click();
    await this.page.waitForURL('**/admin/user-management/customers');
  }
}
