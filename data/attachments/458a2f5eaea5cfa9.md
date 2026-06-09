# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: partnerDashboard.spec.ts >> Custom Fixture – Partner Dashboard Verification >> Partner can navigate to Service Management via sidebar
- Location: tests\partnerDashboard.spec.ts:157:13

# Error details

```
TimeoutError: locator.fill: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('input[name="email"]')

```

# Page snapshot

```yaml
- generic [ref=e6]: Processing
```

# Test source

```ts
  1  | /**
  2  |  * Auth Fixture
  3  |  * Provides pre-authenticated Playwright pages for each user role.
  4  |  * Tests using this fixture skip the login UI and start authenticated.
  5  |  */
  6  | import { test as base, Page } from '@playwright/test';
  7  | import {
  8  |   MOCK_ADMIN_USER,
  9  |   MOCK_PARTNER_USER,
  10 |   MOCK_ADMIN_PROFILE,
  11 |   MOCK_PARTNER_PROFILE,
  12 |   SUCCESS_LOGIN_RESPONSE,
  13 |   MOCK_PROFILE_RESPONSE,
  14 | } from '../data/mockData';
  15 | import { ROUTES } from '../constants/routes';
  16 | import { API_PATTERNS } from '../constants/apiEndpoints';
  17 | import { AuthUser, ProfileData } from '../types/auth.types';
  18 | 
  19 | /** Internal helper: navigate to login, mock routes, and complete sign-in */
  20 | async function loginAs(
  21 |   page: Page,
  22 |   user: AuthUser,
  23 |   profile: ProfileData,
  24 |   redirectPattern: RegExp
  25 | ): Promise<void> {
  26 |   // Set up mocks before navigating
  27 |   await page.route(API_PATTERNS.AUTH_LOGIN, async route => {
  28 |     await route.fulfill({
  29 |       status: 200,
  30 |       contentType: 'application/json',
  31 |       body: JSON.stringify(SUCCESS_LOGIN_RESPONSE(user)),
  32 |     });
  33 |   });
  34 | 
  35 |   await page.route(API_PATTERNS.USER_PROFILE, async route => {
  36 |     await route.fulfill({
  37 |       status: 200,
  38 |       contentType: 'application/json',
  39 |       body: JSON.stringify(MOCK_PROFILE_RESPONSE(profile)),
  40 |     });
  41 |   });
  42 | 
  43 |   await page.goto(ROUTES.AUTH_LOGIN);
> 44 |   await page.locator('input[name="email"]').fill(user.email);
     |                                             ^ TimeoutError: locator.fill: Timeout 10000ms exceeded.
  45 |   await page.locator('input[name="password"]').fill('Admin@123');
  46 |   await page.locator('button[type="submit"]').click();
  47 |   await page.waitForURL(redirectPattern, { timeout: 10_000 });
  48 | }
  49 | 
  50 | // ─── Extended Fixture Types ──────────────────────────────────────────────────
  51 | 
  52 | type AuthFixtures = {
  53 |   /** Page pre-authenticated as Super Admin */
  54 |   adminPage: Page;
  55 |   /** Page pre-authenticated as Service Partner */
  56 |   partnerPage: Page;
  57 | };
  58 | 
  59 | /** Auth fixture — extend this in test files that need pre-auth state */
  60 | export const authTest = base.extend<AuthFixtures>({
  61 |   adminPage: async ({ page }, use) => {
  62 |     await loginAs(page, MOCK_ADMIN_USER, MOCK_ADMIN_PROFILE, /\/admin\/dashboard/);
  63 |     await use(page);
  64 |     // Teardown: clear auth state after test
  65 |     await page.evaluate(() => localStorage.clear());
  66 |   },
  67 | 
  68 |   partnerPage: async ({ page }, use) => {
  69 |     await loginAs(page, MOCK_PARTNER_USER, MOCK_PARTNER_PROFILE, /\/partner\/dashboard/);
  70 |     await use(page);
  71 |     await page.evaluate(() => localStorage.clear());
  72 |   },
  73 | });
  74 | 
```