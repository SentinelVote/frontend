import { Page, expect } from "@playwright/test";

export const UserNumberStartFrom: number = process.env.PLAYWRIGHT_USER_START_FROM
  ? parseInt(process.env.PLAYWRIGHT_USER_START_FROM, 10)
  : 1;

export const UserNumberEndAt: number = process.env.PLAYWRIGHT_USER_END_AT
  ? parseInt(process.env.PLAYWRIGHT_USER_END_AT, 10)
  : 2;

export async function TestUser(page: Page, userNumber: number) {

  let url: string;
  let basename: string | undefined;
  // Listen for console events and print the messages
  page.on('console', msg => {
    console.log(`Browser \`console.log()\`: ${msg.text()}`);
  });

  console.log(`\nSimulating user ${userNumber}...\n`)
  const email = `user${userNumber}@sentinelvote.tech`;
  let password = "password";

  // Login page.
  console.log(`User${userNumber}: Login Page`);
  await page.goto("/");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL("/voter/*")

  url = page.url();
  basename = url.split("/").pop();
  console.log(`User${userNumber}: URL: ${url} Basename: ${basename}`);

  if (basename === "pending-election") {
    console.log(`User${userNumber}: Login Successful (Pending Election)`);
  } else if (basename === "pem-generate") {
    console.log(`User${userNumber}: Login Successful (PEM Generate)`);
  } else if (basename !== "pem-uploader") {
    console.log(`User${userNumber}: Login Failed`);
  } else {
    console.log(`User${userNumber}: Login Successful (PEM Uploader)`);

    // Our actual test continues here.

    for (let i = 0; i < 6; i++) {
      // Hit tab five times, to bring the skip button into focus.
      // It's visually hidden because it's only meant for testing purposes.
      await page.keyboard.press('Tab');
    }
    await page.click('button[id="playwright-skip"]')
    await page.waitForURL("/voter/candidate-selection");
    url = page.url();
    basename = url.split("/").pop();

    expect(basename).toBe(`candidate-selection`);
    console.log("Candidate Selection Page");
    switch (Math.floor(Math.random()*3) + 1) {
      case 1:
        await page.getByLabel("Tharman Shanmugaratnam").check();
        break
      case 2:
        await page.getByLabel("Ng Kok Song").check();
        break
      case 3:
        await page.getByLabel("Tan Kin Lian").check();
        break
    }
    await page.click('button[id="submit-vote"]')
    await page.click('button[id="confirm-vote"]')

    await page.waitForURL("/voter/success");
    url = page.url();
    basename = url.split("/").pop();
    expect(basename).toBe(`success`);
    await page.click('button');

    await page.waitForURL("/");
    url = page.url();
    expect(url.slice(-1)).toBe("/");
    console.log(`User${userNumber}: Vote Successful`);
  }
}
