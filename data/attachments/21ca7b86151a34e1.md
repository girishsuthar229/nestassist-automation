# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: adminDashboard.spec.ts >> Admin Dashboard – Authorization Guard >> Unauthenticated user is redirected to login
- Location: tests\adminDashboard.spec.ts:80:7

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/admin/dashboard", waiting until "load"

```

# Test source

```ts
  1   | /**
  2   |  * Admin Dashboard Tests – Role-Based Access Control & UI
  3   |  *
  4   |  * Demonstrates:
  5   |  * - POM: AdminDashboardPage, LoginPage
  6   |  * - Auth fixtures (pre-login setup with mocked API)
  7   |  * - Role-based access: Admin can access dashboard
  8   |  * - Authorization guard: Partner & unauthenticated user cannot access admin dashboard
  9   |  */
  10  | import { test, expect } from '@playwright/test';
  11  | import { LoginPage } from '../pages/LoginPage';
  12  | import { AdminDashboardPage } from '../pages/AdminDashboardPage';
  13  | import {
  14  |   MOCK_ADMIN_USER,
  15  |   MOCK_PARTNER_USER,
  16  |   MOCK_ADMIN_PROFILE,
  17  |   MOCK_PARTNER_PROFILE,
  18  |   SUCCESS_LOGIN_RESPONSE,
  19  |   MOCK_PROFILE_RESPONSE,
  20  |   MOCK_ADMIN_DASHBOARD_OVERVIEW_RESPONSE,
  21  | } from '../data/mockData';
  22  | import { API_PATTERNS } from '../constants/apiEndpoints';
  23  | import { ROUTES } from '../constants/routes';
  24  | 
  25  | // ─────────────────────────────────────────────────────────────────────────────
  26  | // Suite 1: Admin Access – Positive
  27  | // ─────────────────────────────────────────────────────────────────────────────
  28  | test.describe('Admin Dashboard – Authenticated Admin Access', () => {
  29  |   test.beforeEach(async ({ page }) => {
  30  |     // Pre-authenticate as admin
  31  |     await page.route(API_PATTERNS.AUTH_LOGIN, async route => {
  32  |       await route.fulfill({
  33  |         status: 200,
  34  |         contentType: 'application/json',
  35  |         body: JSON.stringify(SUCCESS_LOGIN_RESPONSE(MOCK_ADMIN_USER)),
  36  |       });
  37  |     });
  38  | 
  39  |     await page.route(API_PATTERNS.USER_PROFILE, async route => {
  40  |       await route.fulfill({
  41  |         status: 200,
  42  |         contentType: 'application/json',
  43  |         body: JSON.stringify(MOCK_PROFILE_RESPONSE(MOCK_ADMIN_PROFILE)),
  44  |       });
  45  |     });
  46  | 
  47  |     await page.route(API_PATTERNS.DASHBOARD_OVERVIEW, async route => {
  48  |       await route.fulfill({
  49  |         status: 200,
  50  |         contentType: 'application/json',
  51  |         body: JSON.stringify(MOCK_ADMIN_DASHBOARD_OVERVIEW_RESPONSE),
  52  |       });
  53  |     });
  54  | 
  55  |     const loginPage = new LoginPage(page);
  56  |     await loginPage.navigate();
  57  |     await loginPage.login(MOCK_ADMIN_USER.email, 'Admin@123');
  58  |     await page.waitForURL(/\/admin\/dashboard/, { timeout: 12000 });
  59  |   });
  60  | 
  61  |   test('Admin can view the dashboard heading', async ({ page }) => {
  62  |     const dashboardPage = new AdminDashboardPage(page);
  63  |     await dashboardPage.assertDashboardVisible();
  64  |   });
  65  | 
  66  |   test('Admin dashboard URL is /admin/dashboard', async ({ page }) => {
  67  |     await expect(page).toHaveURL(/\/admin\/dashboard/);
  68  |   });
  69  | 
  70  |   test('Admin dashboard shows sidebar navigation', async ({ page }) => {
  71  |     const dashboardPage = new AdminDashboardPage(page);
  72  |     await dashboardPage.assertSidebarVisible();
  73  |   });
  74  | });
  75  | 
  76  | // ─────────────────────────────────────────────────────────────────────────────
  77  | // Suite 2: Authorization Guard – Negative
  78  | // ─────────────────────────────────────────────────────────────────────────────
  79  | test.describe('Admin Dashboard – Authorization Guard', () => {
  80  |   test('Unauthenticated user is redirected to login', async ({ page }) => {
> 81  |     await page.goto(ROUTES.ADMIN_DASHBOARD);
      |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  82  |     await expect(page).toHaveURL(/(login|auth\/login)/);
  83  |   });
  84  | 
  85  |   test('Service Partner is redirected away from admin dashboard', async ({ page }) => {
  86  |     // Login as partner
  87  |     await page.route(API_PATTERNS.AUTH_LOGIN, async route => {
  88  |       await route.fulfill({
  89  |         status: 200,
  90  |         contentType: 'application/json',
  91  |         body: JSON.stringify(SUCCESS_LOGIN_RESPONSE(MOCK_PARTNER_USER)),
  92  |       });
  93  |     });
  94  |     await page.route(API_PATTERNS.USER_PROFILE, async route => {
  95  |       await route.fulfill({
  96  |         status: 200,
  97  |         contentType: 'application/json',
  98  |         body: JSON.stringify(MOCK_PROFILE_RESPONSE(MOCK_PARTNER_PROFILE)),
  99  |       });
  100 |     });
  101 | 
  102 |     const loginPage = new LoginPage(page);
  103 |     await loginPage.navigate();
  104 |     await loginPage.login(MOCK_PARTNER_USER.email, 'Admin@123');
  105 |     await page.waitForURL(/\/partner\/dashboard/, { timeout: 12000 });
  106 | 
  107 |     // Try to access admin route
  108 |     await page.goto(ROUTES.ADMIN_DASHBOARD);
  109 |     // Should be redirected away (not stay on admin dashboard)
  110 |     await expect(page).not.toHaveURL(/\/admin\/dashboard/);
  111 |   });
  112 | });
  113 | 
```