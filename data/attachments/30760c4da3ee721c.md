# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: profile.spec.ts >> Profile – Super Admin >> Admin profile displays correct name
- Location: tests\profile.spec.ts:144:7

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/auth/login", waiting until "load"

```

# Test source

```ts
  1  | import { Page, Locator, expect } from '@playwright/test';
  2  | import { UserRole, AuthResponse } from '../types/auth.types';
  3  | 
  4  | export class LoginPage {
  5  |   readonly page: Page;
  6  |   readonly emailInput: Locator;
  7  |   readonly passwordInput: Locator;
  8  |   readonly loginButton: Locator;
  9  |   readonly errorMessage: Locator;
  10 | 
  11 |   constructor(page: Page) {
  12 |     this.page = page;
  13 |     this.emailInput = page.locator('input[name="email"]');
  14 |     this.passwordInput = page.locator('input[name="password"]');
  15 |     this.loginButton = page.locator('button[type="submit"]');
  16 |     this.errorMessage = page.locator('p.text-red-700, p.text-red-500, p[class*="error"]').first(); // Flexible selector for errors
  17 |   }
  18 | 
  19 |   async navigate() {
> 20 |     await this.page.goto('/auth/login');
     |                     ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  21 |   }
  22 | 
  23 |   async login(email: string, password: string) {
  24 |     await this.emailInput.fill(email);
  25 |     await this.passwordInput.fill(password);
  26 |     await this.loginButton.click();
  27 |   }
  28 | 
  29 |   async getErrorMessage() {
  30 |     await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  31 |     return this.errorMessage.textContent();
  32 |   }
  33 | 
  34 |   async waitForRedirection(role: UserRole | string) {
  35 |     if (role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN) {
  36 |       await this.page.waitForURL(url => url.pathname.includes('/admin/dashboard'), { timeout: 10000 });
  37 |       await expect(this.page.locator('h1').filter({ hasText: 'Dashboard' })).toBeVisible();
  38 |     } else if (role === UserRole.SERVICE_PARTNER) {
  39 |       await this.page.waitForURL(url => url.pathname.includes('/partner/dashboard'), { timeout: 10000 });
  40 |       await expect(this.page.locator('h1').filter({ hasText: 'Dashboard' })).toBeVisible();
  41 |     } else {
  42 |       await this.page.waitForURL('**/dashboard', { timeout: 10000 });
  43 |     }
  44 |   }
  45 | 
  46 |   async waitForLoginResponse(): Promise<AuthResponse> {
  47 |     const response = await this.page.waitForResponse(res => 
  48 |       res.url().includes('/auth/login') && res.request().method() === 'POST'
  49 |     );
  50 |     return await response.json() as AuthResponse;
  51 |   }
  52 | }
  53 | 
```