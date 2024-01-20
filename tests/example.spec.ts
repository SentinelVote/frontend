import { expect, test } from "@playwright/test";

const delay = ms => new Promise(res => setTimeout(res, ms));

test("E2E Test", async ({ page }) => {

  await page.goto("http://localhost:3000/admin");
  await page.click('button[id="fold-keys"]')
  console.log("Keys Folded")

  ///
  /// EDIT THIS LINE TO CHANGE THE USER YOU'RE TESTING
      let number = 1;
  ///

  await page.goto("http://localhost:3000");
    console.log(`\nSimulating user ${number}...\n`)
    const email = `user${number}@sentinelvote.tech`;
    let password = "password";
    if (number === 1 || number === 2) {
      password = "Password1!";
    }
    // Go to the login page

    // Fill in the email and password fields
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);

    // Click the login button
    await page.click('button[type="submit"]');

    // Wait for the response and check if the login was successful
    // This will depend on what happens in your app upon successful login
    // For example, you might be redirected to a different page
    await page.waitForNavigation();
    const url = page.url();

    if (url === "http://localhost:3000/voter/pending-election") {
      console.log("Login Successful");
    } else if (url === "http://localhost:3000/voter/pem-generate") {
      console.log("Login Successful");
    } else if (url !== "http://localhost:3000/voter/pem-uploader") {
      console.log("Login Failed");
    } else {
      console.log("Login Successful");
      // Our actual test continues here.
      // Get the cookie user_email
      const cookie = await page.context().cookies();
      const email = cookie[0].value;
      // expect(email).toBe(`user1@sentinelvote.tech`);
      // Click the login button
      await page.click('button[id="playwright-skip"]')
      await page.waitForNavigation();
      const url = page.url();
      // expect(url).toBe(`http://localhost:3000/voter/candidate-selection`);
      console.log("Candidate Selection Page");
      switch (Math.floor(Math.random()*3) + 1) {
        case 1:
          await page.getByLabel("Tharman Shanmugaratnam").check();
        case 2:
          await page.getByLabel("Ng Kok Song").check();
        case 3:
          await page.getByLabel("Tan Kin Lian").check();
      }

      // expect(true).toBe(true);
      await page.click('button[id="submit-vote"]')
      await page.click('button[id="confirm-vote"]')
      await page.waitForNavigation();
      {
        const url = page.url();
        // expect(url).toBe(`http://localhost:3000/voter/success`);
        // click on the only button in the page
        await page.click('button');
      }
      await page.goto("http://localhost:3000");
    }
});
