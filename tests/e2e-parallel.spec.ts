import { test } from "@playwright/test";
import { testUser, userCount } from "./e2e";

let totalStartTime: number;
test.beforeAll(async () => {
  totalStartTime = Date.now();
});

for (let i = 1; i <= userCount; i++) {
    test(`User ${i} Test`, async ({ browser }) => {
      const now = Date.now();
      const context = await browser.newContext();
      const page = await context.newPage();
      await testUser(page, i);
      await context.close();
      const timeTaken = Date.now() - now;
      console.log(`\nTime taken for User ${i}: ${timeTaken}ms\n`);
      if (i === userCount) {
        const totalEndTime = Date.now();
        const totalTimeTaken = totalEndTime - totalStartTime;
        console.log(`Total time taken for all tests: ${totalTimeTaken}ms`);
      }
    });
}
