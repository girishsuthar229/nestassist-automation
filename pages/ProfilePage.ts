  import { Page, Locator, expect } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly userName: Locator;
  readonly userRole: Locator;
  readonly userEmail: Locator;
  readonly userPhone: Locator;
  readonly userAddress: Locator;
  readonly editButton: Locator;
  
  // Modal locators
  readonly mobileInput: Locator;
  readonly emailInput: Locator;
  readonly addressInput: Locator;
  readonly saveButton: Locator;
  readonly toastMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userName = page.locator('.text-neutral-800').first();
    this.userRole = page.locator('.text-neutral-600').first();
    // In DOM: div > svg + label. We use `>` inside `:has()` so it only matches the immediate parent div
    this.userEmail = page.locator('div:has(> svg.lucide-mail) > label').first();
    this.userPhone = page.locator('div:has(> svg.lucide-phone) > label').first();
    this.userAddress = page.locator('div:has(> svg.lucide-map-pin) > label').first();
    this.editButton = page.locator('button:has-text("Edit")');


    this.mobileInput = page.locator('input[name="mobile_number"], input[name="mobile"]');
    this.emailInput = page.locator('input[name="email"]');
    this.addressInput = page.locator('textarea[name="profile_address"], textarea[name="permanent_address"]');
    this.saveButton = page.locator('button:has-text("Save")');
    this.toastMessage = page.locator('div[role="status"]'); // Standard hot-toast role
  }

  async navigate(role: string) {
    const url = role.includes('ADMIN') ? '/admin/my-profile' : '/partner/my-profile';
    await this.page.goto(url);
  }

  async openEditModal() {
    await this.editButton.click();
    await expect(this.mobileInput).toBeVisible();
  }

  async updateContactInfo(data: { mobile?: string; email?: string; address?: string }) {
    if (data.mobile) await this.mobileInput.fill(data.mobile);
    if (data.email) await this.emailInput.fill(data.email);
    if (data.address) await this.addressInput.fill(data.address);
    await this.saveButton.click();
  }

  async verifyToastMessage(expected: string) {
    await expect(this.toastMessage).toContainText(expected);
  }

  async verifyProfileDetails(expected: { name?: string; email?: string; mobile?: string }) {
    if (expected.name) await expect(this.userName).toHaveText(expected.name);
    if (expected.email) await expect(this.userEmail).toHaveText(expected.email);
    if (expected.mobile) await expect(this.userPhone).toContainText(expected.mobile);
  }
}
