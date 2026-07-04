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

  if (!response.ok()) {
  const text = await response.text();
  console.log("STATUS:", response.status());
  console.log("BODY:", text);
  throw new Error("Failed to create employee by API");
}

  expect(response.status()).toBe(200);

  await page.goto("/dashboard");

  await expect(page).not.toHaveURL(/signin/);

  await page.context().storageState({
    path,
  });
}
