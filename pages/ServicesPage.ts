/**
 * ServicesPage – Page Object Model
 * Covers the public services listing page (/services).
 */
import { Page, Locator, expect } from '@playwright/test';
import { ROUTES } from '../constants/routes';

export class ServicesPage {
  readonly page: Page;

  readonly pageHeading: Locator;
  readonly serviceCards: Locator;
  readonly categoryFilters: Locator;
  readonly searchInput: Locator;
  readonly loadingSpinner: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageHeading = page.locator('h1, h2').first();
    this.serviceCards = page.locator('button.group, [class*="card"], [class*="Card"], [class*="service-item"]');
    this.categoryFilters = page.locator('button[class*="filter"], [class*="category-btn"], [class*="tab"]');
    this.searchInput = page.locator('input[placeholder*="search" i]').first();
    this.loadingSpinner = page.locator('[class*="spinner"], [class*="loading"], [role="progressbar"]').first();
    this.emptyState = page.locator('[class*="empty"], p:has-text("no services"), p:has-text("No results")').first();
  }

  async navigate(): Promise<void> {
    await this.page.goto(ROUTES.SERVICES);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForServicesToLoad(): Promise<void> {
    // Wait for either cards (buttons in the modular page) to appear or empty state
    await this.page.waitForFunction(() =>
      document.querySelectorAll('button.group').length > 0 ||
      document.querySelectorAll('[class*="card"]').length > 0 ||
      document.body.innerText.includes("No services found")
    , { timeout: 10000 }).catch(() => {});
  }

  async assertServiceCardsVisible(minCount = 1): Promise<void> {
    await expect(this.serviceCards.first()).toBeVisible({ timeout: 8000 });
    const count = await this.serviceCards.count();
    expect(count).toBeGreaterThanOrEqual(minCount);
  }

  async clickFirstService(): Promise<void> {
    await this.serviceCards.first().click();
  }

  async clickServiceByName(name: string): Promise<void> {
    await this.serviceCards.filter({ hasText: name }).first().click();
  }

  async filterByCategory(categoryName: string): Promise<void> {
    await this.categoryFilters.filter({ hasText: categoryName }).first().click();
  }

  async searchService(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
  }

  async assertHeadingVisible(): Promise<void> {
    await expect(this.pageHeading).toBeVisible();
  }
}
