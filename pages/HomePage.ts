/**
 * HomePage – Page Object Model
 * Covers the landing / home page (route: /)
 */
import { Page, Locator, expect } from '@playwright/test';
import { ROUTES } from '../constants/routes';

export class HomePage {
  readonly page: Page;

  // ─── Hero Section ─────────────────────────────────────────────────────────
  readonly heroSection: Locator;
  readonly heroHeading: Locator;
  readonly heroSubheading: Locator;
  readonly heroSearchInput: Locator;
  readonly heroSearchButton: Locator;

  // ─── Navigation ───────────────────────────────────────────────────────────
  readonly navbar: Locator;
  readonly navServicesLink: Locator;
  readonly navContactUsLink: Locator;
  readonly navSigninButton : Locator;
  readonly navSignupButton: Locator;
  readonly navLogoLink: Locator;

  // ─── Services Section ─────────────────────────────────────────────────────
  readonly servicesSection: Locator;
  readonly serviceCards: Locator;

  // ─── Footer ───────────────────────────────────────────────────────────────
  readonly footer: Locator;
  readonly footerAboutLink: Locator;
  readonly footerContactLink: Locator;
  readonly footerTermsLink: Locator;
  readonly footerPrivacyLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Hero
    this.heroSection = page.locator('section').first();
    this.heroHeading = page.locator('h1').first();
    this.heroSubheading = page.locator('h1 + p, h2 + p').first();
    this.heroSearchInput = page.locator('input[placeholder*="search" i], input[placeholder*="service" i]').first();
    this.heroSearchButton = page.locator('button:has-text("Search"), button[type="submit"]').first();

    // Nav
    this.navbar = page.locator('nav, header').first();
    this.navServicesLink = page.locator('nav a[href*="/services"], header a[href*="/services"]').first();
    this.navContactUsLink = page.locator('nav a[href*="/contact"], header a[href*="/contact"], a:has-text("Contact Us")').first();
    this.navSigninButton  = page.locator('a[href*="/signin"], a[href*="/auth/signin"], button:has-text("Sign In")').first();
    this.navSignupButton = page.locator('a[href*="/signup"], button:has-text("Sign Up"), button:has-text("Get Started")').first();
    this.navLogoLink = page.locator('a[href="/"], header a[href="/"]').first();

    // Services section
    this.servicesSection = page.locator('section:has([class*="service"]), section:has([class*="card"])').first();
    this.serviceCards = page.locator('[class*="service-card"], [class*="ServiceCard"], div[class*="card"]');

    // Footer
    this.footer = page.locator('footer');
    // Footer links are <p onClick={navigate(...)}> elements — NOT <a> tags.
    // Match by visible label text inside the footer.
    this.footerAboutLink = page.locator('footer p:has-text("About Us")');
    this.footerContactLink = page.locator('footer p:has-text("Contact Us")');
    this.footerTermsLink = page.locator('footer p:has-text("Terms & Conditions")');
    this.footerPrivacyLink = page.locator('footer p:has-text("Privacy Policy")');
  }

  async navigate(): Promise<void> {
    await this.page.goto(ROUTES.HOME);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async assertHeroVisible(): Promise<void> {
    await expect(this.heroSection).toBeVisible();
    await expect(this.heroHeading).toBeVisible();
  }

  async assertNavbarVisible(): Promise<void> {
    await expect(this.navbar).toBeVisible();
  }

  async navigateToServices(): Promise<void> {
    await this.navServicesLink.click();
    await this.page.waitForURL('**/services**');
  }

  async navigateToLogin(): Promise<void> {
    await this.navSigninButton.click();
    await this.page.waitForURL(/\/(login|auth\/login)/);
  }

  async searchForService(query: string): Promise<void> {
    await this.heroSearchInput.fill(query);
    await this.heroSearchButton.click();
  }

  async assertFooterLinksVisible(): Promise<void> {
    await expect(this.footer).toBeVisible();
    await expect(this.footerAboutLink).toBeVisible();
    await expect(this.footerContactLink).toBeVisible();
    await expect(this.footerPrivacyLink).toBeVisible();
    await expect(this.footerTermsLink).toBeVisible();
  }

  async assertPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(expectedTitle, 'i'));
  }
}
