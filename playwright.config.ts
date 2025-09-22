import { defineConfig, devices } from "@playwright/test";

/**
 * Konfiguracja Playwright dla testów E2E
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests/e2e",
  /* Uruchom testy równolegle na CI */
  fullyParallel: true,
  /* Nie pozwól na testy, które nie przeszły w CI */
  forbidOnly: !!process.env.CI,
  /* Powtórz nieudane testy na CI */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests na CI */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter do użycia. Zobacz https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Ustawienia wspólne dla wszystkich projektów */
  use: {
    /* URL bazowy do użycia w akcjach takich jak `await page.goto('/')`. */
    baseURL: "http://127.0.0.1:5173",

    /* Zbieraj trace gdy test się nie powiedzie. Zobacz https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Konfiguruj projekty dla głównych przeglądarek */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Test przeciwko mobilnym viewportom. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test przeciwko branded przeglądarkom. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Uruchom lokalny serwer dev przed rozpoczęciem testów */
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: !process.env.CI,
  },
});
