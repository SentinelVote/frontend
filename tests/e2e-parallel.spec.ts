import { test } from "@playwright/test";
import { TestUser, UserNumberStartFrom, UserNumberEndAt } from "./e2e";

let totalStartTime: number;
test.beforeAll(async () => {
  totalStartTime = Date.now();
});

let count = 0;
for (let i = UserNumberStartFrom; i <= UserNumberEndAt; i++) {
    test(`User ${i} Test`, async ({ browser }) => {
      const now = Date.now();
      const context = await browser.newContext();
      const page = await context.newPage();
      await TestUser(page, i);
      await context.close();
      const timeTaken = Date.now() - now;
      console.log(`\nTime taken for User ${i}: ${timeTaken}ms\n`);
      count++;
      if (count === UserNumberEndAt) {
        const totalEndTime = Date.now();
        const totalTimeTaken = totalEndTime - totalStartTime;
        console.log(`Total time taken for all tests: ${totalTimeTaken}ms`);
      }
    });
}
