import { expect, test } from "@playwright/test";

test("signin page loads", async ({ page }) => {
  await page.goto("/signin");

  await expect(
    page.getByRole("heading", { name: /iniciar sesión/i })
  ).toBeVisible();

  await expect(page.getByLabel(/correo/i)).toBeVisible();
  await expect(page.getByLabel(/contraseña/i)).toBeVisible();

  await expect(
    page.getByRole("button", { name: /iniciar sesión/i })
  ).toBeVisible();
});