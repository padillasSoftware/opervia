import { expect, type Page } from "@playwright/test";

export async function createStorageState(
  page: Page,
  email: string,
  password: string,
  path: string,
) {
  const response = await page.request.post("/api/auth/signin", {
    data: {
      email,
      password,
    },
  });

  expect(response.status()).toBe(200);

  await page.goto("/dashboard");

  await expect(page).not.toHaveURL(/signin/);

  await page.context().storageState({
    path,
  });
}
