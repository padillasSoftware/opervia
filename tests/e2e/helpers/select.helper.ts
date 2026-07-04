import { expect, type Locator } from "@playwright/test";

export async function openSelect (select: Locator) {
  await expect(select).toBeVisible();
  await expect(select).toBeEnabled();

  await select.hover();
  await select.click({ delay: 100 });
}