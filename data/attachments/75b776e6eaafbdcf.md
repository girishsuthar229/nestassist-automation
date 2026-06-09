# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> Home Page – Landing Page Tests >> Unauthenticated user accessing /admin/dashboard is redirected to login
- Location: tests\home.spec.ts:49:7

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/", waiting until "load"

```

# Test source

```ts
  1   | /**
  2   |  * HomePage – Page Object Model
  3   |  * Covers the landing / home page (route: /)
  4   |  */
  5   | import { Page, Locator, expect } from '@playwright/test';
  6   | import { ROUTES } from '../constants/routes';
  7   | 
  8   | export class HomePage {
  9   |   readonly page: Page;
  10  | 
  11  |   // ─── Hero Section ─────────────────────────────────────────────────────────
  12  |   readonly heroSection: Locator;
  13  |   readonly heroHeading: Locator;
  14  |   readonly heroSubheading: Locator;
  15  |   readonly heroSearchInput: Locator;
  16  |   readonly heroSearchButton: Locator;
  17  | 
  18  |   // ─── Navigation ───────────────────────────────────────────────────────────
  19  |   readonly navbar: Locator;
  20  |   readonly navServicesLink: Locator;
  21  |   readonly navContactUsLink: Locator;
  22  |   readonly navSigninButton : Locator;
  23  |   readonly navSignupButton: Locator;
  24  |   readonly navLogoLink: Locator;
  25  | 
  26  |   // ─── Services Section ─────────────────────────────────────────────────────
  27  |   readonly servicesSection: Locator;
  28  |   readonly serviceCards: Locator;
  29  | 
  30  |   // ─── Footer ───────────────────────────────────────────────────────────────
  31  |   readonly footer: Locator;
  32  |   readonly footerAboutLink: Locator;
  33  |   readonly footerContactLink: Locator;
  34  |   readonly footerTermsLink: Locator;
  35  |   readonly footerPrivacyLink: Locator;
  36  | 
  37  |   constructor(page: Page) {
  38  |     this.page = page;
  39  | 
  40  |     // Hero
  41  |     this.heroSection = page.locator('section').first();
  42  |     this.heroHeading = page.locator('h1').first();
  43  |     this.heroSubheading = page.locator('h1 + p, h2 + p').first();
  44  |     this.heroSearchInput = page.locator('input[placeholder*="search" i], input[placeholder*="service" i]').first();
  45  |     this.heroSearchButton = page.locator('button:has-text("Search"), button[type="submit"]').first();
  46  | 
  47  |     // Nav
  48  |     this.navbar = page.locator('nav, header').first();
  49  |     this.navServicesLink = page.locator('nav a[href*="/services"], header a[href*="/services"]').first();
  50  |     this.navContactUsLink = page.locator('nav a[href*="/contact"], header a[href*="/contact"], a:has-text("Contact Us")').first();
  51  |     this.navSigninButton  = page.locator('a[href*="/signin"], a[href*="/auth/signin"], button:has-text("Sign In")').first();
  52  |     this.navSignupButton = page.locator('a[href*="/signup"], button:has-text("Sign Up"), button:has-text("Get Started")').first();
  53  |     this.navLogoLink = page.locator('a[href="/"], header a[href="/"]').first();
  54  | 
  55  |     // Services section
  56  |     this.servicesSection = page.locator('section:has([class*="service"]), section:has([class*="card"])').first();
  57  |     this.serviceCards = page.locator('[class*="service-card"], [class*="ServiceCard"], div[class*="card"]');
  58  | 
  59  |     // Footer
  60  |     this.footer = page.locator('footer');
  61  |     // Footer links are <p onClick={navigate(...)}> elements — NOT <a> tags.
  62  |     // Match by visible label text inside the footer.
  63  |     this.footerAboutLink = page.locator('footer p:has-text("About Us")');
  64  |     this.footerContactLink = page.locator('footer p:has-text("Contact Us")');
  65  |     this.footerTermsLink = page.locator('footer p:has-text("Terms & Conditions")');
  66  |     this.footerPrivacyLink = page.locator('footer p:has-text("Privacy Policy")');
  67  |   }
  68  | 
  69  |   async navigate(): Promise<void> {
> 70  |     await this.page.goto(ROUTES.HOME);
      |                     ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  71  |     await this.page.waitForLoadState('domcontentloaded');
  72  |   }
  73  | 
  74  |   async assertHeroVisible(): Promise<void> {
  75  |     await expect(this.heroSection).toBeVisible();
  76  |     await expect(this.heroHeading).toBeVisible();
  77  |   }
  78  | 
  79  |   async assertNavbarVisible(): Promise<void> {
  80  |     await expect(this.navbar).toBeVisible();
  81  |   }
  82  | 
  83  |   async navigateToServices(): Promise<void> {
  84  |     await this.navServicesLink.click();
  85  |     await this.page.waitForURL('**/services**');
  86  |   }
  87  | 
  88  |   async navigateToLogin(): Promise<void> {
  89  |     await this.navSigninButton.click();
  90  |     await this.page.waitForURL(/\/(login|auth\/login)/);
  91  |   }
  92  | 
  93  |   async searchForService(query: string): Promise<void> {
  94  |     await this.heroSearchInput.fill(query);
  95  |     await this.heroSearchButton.click();
  96  |   }
  97  | 
  98  |   async assertFooterLinksVisible(): Promise<void> {
  99  |     await expect(this.footer).toBeVisible();
  100 |     await expect(this.footerAboutLink).toBeVisible();
  101 |     await expect(this.footerContactLink).toBeVisible();
  102 |     await expect(this.footerPrivacyLink).toBeVisible();
  103 |     await expect(this.footerTermsLink).toBeVisible();
  104 |   }
  105 | 
  106 |   async assertPageTitle(expectedTitle: string): Promise<void> {
  107 |     await expect(this.page).toHaveTitle(new RegExp(expectedTitle, 'i'));
  108 |   }
  109 | }
  110 | 
```