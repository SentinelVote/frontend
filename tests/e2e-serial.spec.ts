import { test } from "@playwright/test";
import { testUser, userCount } from "./e2e";

let totalStartTime: number;
test.beforeAll(async () => {
  totalStartTime = Date.now();
});

test.describe.serial(`E2E Test for Users`, () => {
    for (let i = 1; i <= userCount; i++) {
      test(`User ${i} Test`, async ({page}) => {
        const now = Date.now();
        await testUser(page, i);
        const timeTaken = Date.now() - now;
        console.log(`\nTime taken for User ${i}: ${timeTaken}ms\n`);
      });
    }
  }
);

test.afterAll(async () => {
  const totalEndTime = Date.now();
  const totalTimeTaken = totalEndTime - totalStartTime;
  console.log(`Total time taken for all tests: ${totalTimeTaken}ms`);
});
