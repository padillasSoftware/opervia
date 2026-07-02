import { expect, type Locator } from "@playwright/test";

export async function expectToHaveRows(table: Locator, minRows = 1) {
  await expect
    .poll(async () => table.locator("tbody tr").count())
    .toBeGreaterThanOrEqual(minRows);
}