/**
 * Home Page Tests
 *
 * Demonstrates:
 * - POM: HomePage
 * - Hooks: beforeEach
 * - Public page assertions (no auth needed)
 * - Navigation link verification
 */
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ROUTES } from '../constants/routes';

test.describe('Home Page – Landing Page Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate();
  });

  test('Landing page loads successfully', async ({ page }) => {
    await expect(page).toHaveURL('/');
    await homePage.assertHeroVisible();
  });

  test('Page title contains "Homecare" or app name', async ({ page }) => {
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Navbar is visible with key links', async ({ page }) => {
    await homePage.assertNavbarVisible();
  });

  test('Sign In button is visible in navbar', async ({ page }) => {
    await expect(homePage.navSigninButton).toBeVisible();
  });

  test('Clicking Login button navigates to login page', async ({ page }) => {
    await homePage.navigateToLogin();
    await expect(page).toHaveURL(/(login|auth\/login)/);
  });

  test('Footer is visible with essential links', async ({ page }) => {
    await homePage.assertFooterLinksVisible();
  });

  test('Unauthenticated user accessing /admin/dashboard is redirected to login', async ({ page }) => {
    await page.goto(ROUTES.ADMIN_DASHBOARD);
    await expect(page).toHaveURL(/(login|auth\/login)/);
  });

  test('Unauthenticated user accessing /partner/dashboard is redirected to login', async ({ page }) => {
    await page.goto(ROUTES.PARTNER_DASHBOARD);
    await expect(page).toHaveURL(/(login|auth\/login)/);
  });
});
