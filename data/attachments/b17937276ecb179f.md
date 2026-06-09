# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: partnerDashboard.spec.ts >> Partner Dashboard – Authorization Guard >> Unauthenticated user is redirected to login
- Location: tests\partnerDashboard.spec.ts:80:7

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/partner/dashboard", waiting until "load"

```

# Test source

```ts
  1   | /**
  2   |  * Partner Dashboard Tests
  3   |  *
  4   |  * Demonstrates:
  5   |  * - POM: PartnerDashboardPage, LoginPage
  6   |  * - Mock API setup as beforeAll/beforeEach hooks
  7   |  * - Role-based access: Partner can access their dashboard
  8   |  * - Authorization guard: Admin is redirected from partner dashboard
  9   |  */
  10  | import { test, expect } from '@playwright/test';
  11  | import { LoginPage } from '../pages/LoginPage';
  12  | import { PartnerDashboardPage } from '../pages/PartnerDashboardPage';
  13  | import {
  14  |   MOCK_ADMIN_USER,
  15  |   MOCK_PARTNER_USER,
  16  |   MOCK_ADMIN_PROFILE,
  17  |   MOCK_PARTNER_PROFILE,
  18  |   SUCCESS_LOGIN_RESPONSE,
  19  |   MOCK_PROFILE_RESPONSE,
  20  |   MOCK_PARTNER_DASHBOARD_OVERVIEW_RESPONSE,
  21  | } from '../data/mockData';
  22  | import { API_PATTERNS } from '../constants/apiEndpoints';
  23  | import { ROUTES } from '../constants/routes';
  24  | import { test as customTest } from '@fixtures/index';
  25  | 
  26  | // ─────────────────────────────────────────────────────────────────────────────
  27  | // Suite 1: Partner Access – Positive
  28  | // ─────────────────────────────────────────────────────────────────────────────
  29  | test.describe('Partner Dashboard – Authenticated Partner Access', () => {
  30  |   test.beforeEach(async ({ page }) => {
  31  |     await page.route(API_PATTERNS.AUTH_LOGIN, async route => {
  32  |       await route.fulfill({
  33  |         status: 200,
  34  |         contentType: 'application/json',
  35  |         body: JSON.stringify(SUCCESS_LOGIN_RESPONSE(MOCK_PARTNER_USER)),
  36  |       });
  37  |     });
  38  | 
  39  |     await page.route(API_PATTERNS.USER_PROFILE, async route => {
  40  |       await route.fulfill({
  41  |         status: 200,
  42  |         contentType: 'application/json',
  43  |         body: JSON.stringify(MOCK_PROFILE_RESPONSE(MOCK_PARTNER_PROFILE)),
  44  |       });
  45  |     });
  46  | 
  47  |     await page.route(API_PATTERNS.DASHBOARD_ANALYTICS, async route => {
  48  |       await route.fulfill({
  49  |         status: 200,
  50  |         contentType: 'application/json',
  51  |         body: JSON.stringify(MOCK_PARTNER_DASHBOARD_OVERVIEW_RESPONSE),
  52  |       });
  53  |     });
  54  | 
  55  |     const loginPage = new LoginPage(page);
  56  |     await loginPage.navigate();
  57  |     await loginPage.login(MOCK_PARTNER_USER.email, 'Admin@123');
  58  |     await page.waitForURL(/\/partner\/dashboard/, { timeout: 12000 });
  59  |   });
  60  | 
  61  |   test('Partner can view the dashboard', async ({ page }) => {
  62  |     const dashboard = new PartnerDashboardPage(page);
  63  |     await dashboard.assertDashboardVisible();
  64  |   });
  65  | 
  66  |   test('Partner dashboard URL is /partner/dashboard', async ({ page }) => {
  67  |     await expect(page).toHaveURL(/\/partner\/dashboard/);
  68  |   });
  69  | 
  70  |   test('Partner dashboard shows sidebar', async ({ page }) => {
  71  |     const dashboard = new PartnerDashboardPage(page);
  72  |     await dashboard.assertSidebarVisible();
  73  |   });
  74  | });
  75  | 
  76  | // ─────────────────────────────────────────────────────────────────────────────
  77  | // Suite 2: Authorization Guard – Negative
  78  | // ─────────────────────────────────────────────────────────────────────────────
  79  | test.describe('Partner Dashboard – Authorization Guard', () => {
  80  |   test('Unauthenticated user is redirected to login', async ({ page }) => {
> 81  |     await page.goto(ROUTES.PARTNER_DASHBOARD);
      |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  82  |     await expect(page).toHaveURL(/(login|auth\/login)/);
  83  |   });
  84  | 
  85  |   test('Admin is redirected away from partner dashboard', async ({ page }) => {
  86  |     // Login as admin
  87  |     await page.route(API_PATTERNS.AUTH_LOGIN, async route => {
  88  |       await route.fulfill({
  89  |         status: 200,
  90  |         contentType: 'application/json',
  91  |         body: JSON.stringify(SUCCESS_LOGIN_RESPONSE(MOCK_ADMIN_USER)),
  92  |       });
  93  |     });
  94  |     await page.route(API_PATTERNS.USER_PROFILE, async route => {
  95  |       await route.fulfill({
  96  |         status: 200,
  97  |         contentType: 'application/json',
  98  |         body: JSON.stringify(MOCK_PROFILE_RESPONSE(MOCK_ADMIN_PROFILE)),
  99  |       });
  100 |     });
  101 | 
  102 |     const loginPage = new LoginPage(page);
  103 |     await loginPage.navigate();
  104 |     await loginPage.login(MOCK_ADMIN_USER.email, 'Admin@123');
  105 |     await page.waitForURL(/\/admin\/dashboard/, { timeout: 12000 });
  106 | 
  107 |     // Try to access partner route
  108 |     await page.goto(ROUTES.PARTNER_DASHBOARD);
  109 |     await expect(page).not.toHaveURL(/\/partner\/dashboard/);
  110 |   });
  111 | });
  112 | 
  113 | // ─────────────────────────────────────────────────────────────────────────────
  114 | // Suite 3: Custom Fixture – partnerPage (pre-authenticated partner)
  115 | //
  116 | // How it works:
  117 | //   `customTest` = mergeTests(authTest, mockTest) from @fixtures/index
  118 | //   - `partnerPage` fixture (authFixture.ts) automatically:
  119 | //       1. Mocks AUTH_LOGIN → SUCCESS_LOGIN_RESPONSE(MOCK_PARTNER_USER)
  120 | //       2. Mocks USER_PROFILE → MOCK_PROFILE_RESPONSE(MOCK_PARTNER_PROFILE)
  121 | //       3. Navigates to /auth/login, fills email + password, clicks submit
  122 | //       4. Waits for redirect to /partner/dashboard
  123 | //       5. Provides the authenticated Page to the test
  124 | //       6. Clears localStorage on teardown
  125 | //   - `mock` fixture (mockFixture.ts) gives helper methods for extra mocks
  126 | //
  127 | // These tests verify the fixture works correctly — no manual login needed.
  128 | // ─────────────────────────────────────────────────────────────────────────────
  129 | customTest.describe('Custom Fixture – Partner Dashboard Verification', () => {
  130 | 
  131 |   customTest('partnerPage fixture lands on /partner/dashboard', async ({ partnerPage }) => {
  132 |     // The authFixture already logged in and redirected — just verify the URL
  133 |     await expect(partnerPage).toHaveURL(/\/partner\/dashboard/);
  134 |   });
  135 | 
  136 |   customTest('Partner dashboard heading is visible via fixture', async ({ partnerPage }) => {
  137 |     const dashboard = new PartnerDashboardPage(partnerPage);
  138 |     await dashboard.assertDashboardVisible();
  139 |   });
  140 | 
  141 |   customTest('Partner sidebar is rendered via fixture', async ({ partnerPage }) => {
  142 |     const dashboard = new PartnerDashboardPage(partnerPage);
  143 |     await dashboard.assertSidebarVisible();
  144 |   });
  145 | 
  146 |   customTest('Partner KPI cards are displayed with mock data', async ({ partnerPage, mock }) => {
  147 |     const dashboard = new PartnerDashboardPage(partnerPage);
  148 |     await mock.partnerDashboardAnalytics();
  149 |     await partnerPage.reload(); // Reload to fetch with new mock
  150 |     
  151 |     // The fixture pre-authenticates so KPI cards from the mock should render
  152 |     await expect(dashboard.statsCards.first()).toBeVisible({ timeout: 10_000 });
  153 |     // Verify at least one expected KPI value from MOCK_PARTNER_DASHBOARD_OVERVIEW_RESPONSE
  154 |     await expect(partnerPage.locator('text=₹120k').first()).toBeVisible();
  155 |   });
  156 | 
  157 |   customTest('Partner can navigate to Service Management via sidebar', async ({ partnerPage }) => {
  158 |     const dashboard = new PartnerDashboardPage(partnerPage);
  159 |     await dashboard.assertSidebarVisible();
  160 |     await dashboard.navigateToServiceManagement();
  161 |     await expect(partnerPage).toHaveURL(/\/partner\/service-management/);
  162 |   });
  163 | 
  164 |   customTest('Partner can navigate to Profile via sidebar', async ({ partnerPage }) => {
  165 |     const dashboard = new PartnerDashboardPage(partnerPage);
  166 |     await dashboard.assertSidebarVisible();
  167 |     await dashboard.navigateToProfile();
  168 |     await expect(partnerPage).toHaveURL(/\/partner\/my-profile/);
  169 |   });
  170 | 
  171 |   customTest('mock fixture can layer additional mocks on partnerPage', async ({ partnerPage, mock }) => {
  172 |     // Demonstrate that the mock fixture works alongside partnerPage
  173 |     // Add extra mock for services list on the already-authenticated page
  174 |     await mock.servicesList();
  175 |     await partnerPage.goto(ROUTES.PARTNER_SERVICE_MANAGEMENT);
  176 |     // Just verify the page navigated — services mock is now active
  177 |     await expect(partnerPage).toHaveURL(/\/partner\/service-management/);
  178 |   });
  179 | });
  180 | 
```