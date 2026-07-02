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

  const body = await response.text();

  console.log("LOGIN STATUS:", response.status());
  console.log("LOGIN BODY:", body);

  expect(response.status()).toBe(200);

  await page.goto("/dashboard");

  await expect(page).not.toHaveURL(/signin/);

  await page.context().storageState({
    path,
  });
}
