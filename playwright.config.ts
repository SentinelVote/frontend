import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',     // Local testing.
    baseURL: 'https://voter-app.vercel.app', // Production.

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  timeout: 180000,

  /* Configure projects for major browsers */
  // projects: [
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  // ],
});
/*
PLAYWRIGHT_USER_START_FROM=1 PLAYWRIGHT_USER_END_AT=100 npx playwright test --headed --browser=chromium tests/e2e-parallel.spec.ts
PLAYWRIGHT_USER_START_FROM=101 PLAYWRIGHT_USER_END_AT=200 npx playwright test --headed --browser=chromium tests/e2e-parallel.spec.ts
PLAYWRIGHT_USER_START_FROM=201 PLAYWRIGHT_USER_END_AT=300 npx playwright test --headed --browser=chromium tests/e2e-parallel.spec.ts
PLAYWRIGHT_USER_START_FROM=301 PLAYWRIGHT_USER_END_AT=400 npx playwright test --headed --browser=chromium tests/e2e-parallel.spec.ts
PLAYWRIGHT_USER_START_FROM=401 PLAYWRIGHT_USER_END_AT=500 npx playwright test --headed --browser=chromium tests/e2e-parallel.spec.ts
*/
