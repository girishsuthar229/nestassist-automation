# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: forgotPassword.spec.ts >> Forgot Password – All Scenarios >> Registered email – shows success message after submission
- Location: tests\forgotPassword.spec.ts:27:7

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/auth/forgot-password", waiting until "load"

```

# Test source

```ts
  1   | /**
  2   |  * ForgotPasswordPage – Page Object Model
  3   |  * Covers /auth/forgot-password and /auth/reset-password flows.
  4   |  */
  5   | import { Page, Locator, expect } from '@playwright/test';
  6   | import { ROUTES } from '../constants/routes';
  7   | 
  8   | export class ForgotPasswordPage {
  9   |   readonly page: Page;
  10  | 
  11  |   //Forgot Password Form
  12  |   readonly emailInput: Locator;
  13  |   readonly submitButton: Locator;
  14  |   readonly successMessage: Locator;
  15  |   readonly errorMessage: Locator;
  16  |   readonly backToLoginLink: Locator;
  17  | 
  18  |   //Reset Password Form
  19  |   readonly newPasswordInput: Locator;
  20  |   readonly confirmPasswordInput: Locator;
  21  |   readonly resetSubmitButton: Locator;
  22  |   readonly resetSuccessMessage: Locator;
  23  |   readonly resetErrorMessage: Locator;
  24  | 
  25  |   constructor(page: Page) {
  26  |     this.page = page;
  27  | 
  28  |     this.emailInput = page.locator('input[name="email"], input[type="email"]').first();
  29  |     this.submitButton = page.locator('button[type="submit"]');
  30  |     this.successMessage = page.locator(
  31  |       'p[class*="success"], div[class*="success"], [class*="alert-success"], p:has-text("sent"), div:has-text("reset link")'
  32  |     ).first();
  33  |     this.errorMessage = page.locator(
  34  |       'p[class*="error"], span[class*="error"], div[role="alert"], p.text-red-500, p.text-red-700, .text-red-500, .text-red-700'
  35  |     ).first();
  36  |     this.backToLoginLink = page.locator('a, button').filter({ hasText: /Back to Login|Login/i });
  37  | 
  38  |     this.newPasswordInput = page.locator('input[name="newPassword"], input[name="password"]').first();
  39  |     this.confirmPasswordInput = page.locator('input[name="confirmPassword"], input[name="confirm_password"]').first();
  40  |     this.resetSubmitButton = page.locator('button[type="submit"]');
  41  |     this.resetSuccessMessage = page.locator('p:has-text("reset"), div:has-text("successfully")').first();
  42  |     this.resetErrorMessage = page.locator('p[class*="error"], div[role="alert"]').first();
  43  |   }
  44  | 
  45  |   async navigate(): Promise<void> {
> 46  |     await this.page.goto(ROUTES.AUTH_FORGOT_PASSWORD);
      |                     ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  47  |     await this.page.waitForLoadState('domcontentloaded');
  48  |   }
  49  | 
  50  |   async fillEmail(email: string): Promise<void> {
  51  |     await this.emailInput.fill(email);
  52  |   }
  53  | 
  54  |   async submit(): Promise<void> {
  55  |     await this.submitButton.click({ force: true });
  56  |   }
  57  | 
  58  |   async submitForgotPassword(email: string): Promise<void> {
  59  |     await this.fillEmail(email);
  60  |     await this.submit();
  61  |   }
  62  | 
  63  |   async assertSuccessMessageVisible(expectedText?: string): Promise<void> {
  64  |     await expect(this.successMessage).toBeVisible({ timeout: 8000 });
  65  |     if (expectedText) {
  66  |       await expect(this.successMessage).toContainText(expectedText, { ignoreCase: true });
  67  |     }
  68  |   }
  69  | 
  70  |   async assertErrorMessageVisible(expectedText?: string): Promise<void> {
  71  |     await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  72  |     if (expectedText) {
  73  |       await expect(this.errorMessage).toContainText(expectedText, { ignoreCase: true });
  74  |     }
  75  |   }
  76  | 
  77  |   async clickBackToLogin(): Promise<void> {
  78  |     await this.backToLoginLink.first().click();
  79  |     await this.page.waitForURL(/\/(login|auth\/login)/);
  80  |   }
  81  | 
  82  |   async navigateToReset(token: string): Promise<void> {
  83  |     await this.page.goto(`${ROUTES.AUTH_RESET_PASSWORD}/${token}`);
  84  |     await this.page.waitForLoadState('domcontentloaded');
  85  |   }
  86  | 
  87  |   async fillResetForm(newPassword: string, confirmPassword?: string): Promise<void> {
  88  |     await this.newPasswordInput.fill(newPassword);
  89  |     if (confirmPassword !== undefined) {
  90  |       await this.confirmPasswordInput.fill(confirmPassword);
  91  |     }
  92  |   }
  93  | 
  94  |   async submitReset(): Promise<void> {
  95  |     await this.resetSubmitButton.click();
  96  |   }
  97  | 
  98  |   async assertResetSuccessVisible(): Promise<void> {
  99  |     await expect(this.resetSuccessMessage).toBeVisible({ timeout: 8000 });
  100 |   }
  101 | 
  102 |   async assertResetErrorVisible(expectedText?: string): Promise<void> {
  103 |     await expect(this.resetErrorMessage).toBeVisible({ timeout: 5000 });
  104 |     if (expectedText) {
  105 |       await expect(this.resetErrorMessage).toContainText(expectedText, { ignoreCase: true });
  106 |     }
  107 |   }
  108 | }
  109 | 
```