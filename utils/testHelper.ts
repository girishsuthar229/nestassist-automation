/**
 * General Test Utilities
 * Reusable helper functions used across multiple test files.
 */
import { Page, Locator, expect } from '@playwright/test';

// ─────────────────────────────────────────────────────────────────────────────
// WAIT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wait for an element to be visible and then click it.
 * More reliable than direct click for dynamically rendered elements.
 */
export async function waitAndClick(page: Page, selector: string, timeout = 8000): Promise<void> {
  const el = page.locator(selector);
  await el.waitFor({ state: 'visible', timeout });
  await el.click();
}

/**
 * Wait for a toast / notification message containing the expected text.
 * Covers common toast libraries (hot-toast, react-toastify, sonner).
 */
export async function expectToastMessage(page: Page, expectedText: string): Promise<void> {
  const toastSelector = [
    'div[role="status"]',
    'div[role="alert"]',
    'li[role="status"]',
    '.toast',
    '[data-testid="toast"]',
  ].join(', ');

  const toast = page.locator(toastSelector).filter({ hasText: expectedText }).first();
  await expect(toast).toBeVisible({ timeout: 8000 });
}

/**
 * Wait for network to go idle (useful after form submissions).
 */
export async function waitForNetworkIdle(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
}

// ─────────────────────────────────────────────────────────────────────────────
// FORM HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Clear and fill an input field reliably.
 */
export async function clearAndFill(locator: Locator, value: string): Promise<void> {
  await locator.clear();
  await locator.fill(value);
}

/**
 * Check that a form field shows a validation error.
 */
export async function expectValidationError(page: Page, fieldName: string, errorText?: string): Promise<void> {
  const error = page.locator(`[data-error="${fieldName}"], p:near(input[name="${fieldName}"]), span.error`).first();
  if (errorText) {
    await expect(error).toContainText(errorText);
  } else {
    await expect(error).toBeVisible();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREENSHOT HELPER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Take a named screenshot and save to test-results/.
 * Useful for documenting test state at key steps.
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ path: `test-results/screenshots/${name}-${timestamp}.png`, fullPage: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// URL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the current page pathname (without origin).
 */
export async function getCurrentPath(page: Page): Promise<string> {
  return new URL(page.url()).pathname;
}

/**
 * Wait for a URL pattern and assert it matches.
 */
export async function expectURL(page: Page, pattern: string | RegExp, timeout = 10000): Promise<void> {
  await page.waitForURL(pattern instanceof RegExp ? pattern : `**${pattern}`, { timeout });
}
