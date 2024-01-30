import { Page, expect } from "@playwright/test";

export const UserNumberStartFrom: number = process.env.PLAYWRIGHT_USER_START_FROM
  ? parseInt(process.env.PLAYWRIGHT_USER_START_FROM, 10)
  : 1;

export const UserNumberEndAt: number = process.env.PLAYWRIGHT_USER_END_AT
  ? parseInt(process.env.PLAYWRIGHT_USER_END_AT, 10)
  : 2;

export async function TestUser(page: Page, userNumber: number) {

  // Listen for console events and print the messages
  page.on('console', msg => {
    console.log(`Browser \`console.log()\`: ${msg.text()}`);
  });

  console.log(`\nSimulating user ${userNumber}...\n`)
  const email = `user${userNumber}@sentinelvote.tech`;
  let password = "password";
  if (userNumber === 1 || userNumber === 2) {
    password = "Password1!";
  }

  // Login page.
  console.log(`User${userNumber}: Login Page`);
  await page.goto("http://localhost:3000");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL("http://localhost:3000/voter/*")
  const url = page.url();

  if (url === "http://localhost:3000/voter/pending-election") {
    console.log(`User${userNumber}: Login Successful`);
  } else if (url === "http://localhost:3000/voter/pem-generate") {
    console.log(`User${userNumber}: Login Successful`);
  } else if (url !== "http://localhost:3000/voter/pem-uploader") {
    console.log(`User${userNumber}: Login Failed`);
  } else {
    console.log(`User${userNumber}: Login Successful`);
    console.log(`User${userNumber}: PEM Uploader Page`);
    // Our actual test continues here.
    // Click the login button
    await page.click('button[id="playwright-skip"]')
    await page.waitForURL("http://localhost:3000/voter/candidate-selection");
    expect(page.url()).toBe(`http://localhost:3000/voter/candidate-selection`);
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
    await page.waitForURL("http://localhost:3000/voter/success");
    expect(page.url()).toBe(`http://localhost:3000/voter/success`);
    await page.click('button');
    await page.waitForURL("http://localhost:3000/");
    expect(page.url()).toBe(`http://localhost:3000/`);
  }
}



