import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" })
  ).toBeVisible();
});

test("Login Test", async ({ page }) => {
  // Go to the login page
  await page.goto("http://localhost:3000");

  // Fill in the email and password fields
  await page.fill('input[name="email"]', "user1@sentinelvote.tech");
  await page.fill('input[name="password"]', "Password1!");

  // Click the login button
  await page.click('button[type="submit"]');

  // Wait for the response and check if the login was successful
  // This will depend on what happens in your app upon successful login
  // For example, you might be redirected to a different page
  await page.waitForNavigation();
  const url = page.url();
  expect(url).toBe("http://localhost:3000/voter/pem-uploader");
});
