/**
 * Auth Helper
 * Utility to inject auth tokens directly into browser storage —
 * useful for tests that need to be pre-authenticated without going
 * through the full login UI flow.
 */
import { Page } from '@playwright/test';

/**
 * Inject an auth token into localStorage.
 * Key names must match what the frontend reads (check context/AuthContext.tsx).
 */
export async function setAuthToken(page: Page, token: string): Promise<void> {
  await page.evaluate((t: string) => {
    localStorage.setItem('token', t);
    localStorage.setItem('authToken', t);
  }, token);
}

/**
 * Clear all auth state from localStorage and sessionStorage.
 */
export async function clearAuthState(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Read the token from localStorage (useful for API tests).
 */
export async function getStoredToken(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    return localStorage.getItem('token') || localStorage.getItem('authToken');
  });
}

/**
 * Set the user role in localStorage (for tests that check role-based UI).
 */
export async function setUserRole(page: Page, role: string): Promise<void> {
  await page.evaluate((r: string) => {
    localStorage.setItem('userRole', r);
  }, role);
}
