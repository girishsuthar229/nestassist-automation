import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: process.env.CI === "true",
  /* Retry on CI only, or via PW_RETRIES env var */
  retries: Number(process.env.PW_RETRIES) || 1,
  /* Opt out of parallel tests on CI */
  workers:
    process.env.CI === "true" ? 1 : Number(process.env.PW_WORKERS) || undefined,
  /* Reporter configuration */
  reporter: [
    [
      process.env.REPORTER || "html",
      {
        outputFolder: "playwright-report",
        open: "never",
        embedScreenshots: true,
        embedVideos: true,
      },
    ],
    ["allure-playwright"],
    ["list"], // console output for CI
  ],
  /* Global settings shared across all projects */
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    baseURL: process.env.FRONTEND_BASE_URL,

    /* Collect artifacts on failure */
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",

    /* Default timeout for actions */
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  /* Configure projects for major browsers */
  projects: [
    { name: "Desktop Chrome", use: { ...devices["Desktop Chrome"] } },
    // Uncomment to enable multi-browser testing:
    // {
    //   name: "chromium",
    //   use: { ...devices["Desktop Chrome"] },
    // },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
