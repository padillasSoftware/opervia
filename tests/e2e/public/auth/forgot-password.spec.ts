import { test, expect } from "@playwright/test";

test.describe("Forgot password", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forgot-password");
    await page.waitForTimeout(3000);
  });

  test("shows an error when the email is empty", async ({ page }) => {
    
    await page
      .getByRole("button", { name: "Enviar enlace de recuperación" })
      .click();

    await expect(
      page.getByText("El correo electrónico es obligatorio.")
    ).toBeVisible();
  });

  test("shows an error when the email is not valid", async ({ page }) => {
    await page
      .getByRole("textbox", { name: "Correo electrónico" })
      .fill("correo-invalido");

    await page
      .getByRole("button", { name: "Enviar enlace de recuperación" })
      .click();

    await expect(
      page.getByText("Ingresa un correo electrónico válido.")
    ).toBeVisible();
  });

  test("sends the request and redirects to the sign-in page", async ({ page }) => {
    let requestBody: unknown = null;

    await page.route("**/api/auth/forgot-password", async (route) => {
      requestBody = route.request().postDataJSON();

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          statusCode: 200,
          message: "Solicitud enviada",
        }),
      });
    });

    await page
      .getByRole("textbox", { name: "Correo electrónico" })
      .fill("usuario@test.com");

    await page
      .getByRole("button", { name: "Enviar enlace de recuperación" })
      .click();

    expect(requestBody).toEqual({
      email: "usuario@test.com",
    });

    await expect(page).toHaveURL(/\/signin$/);
  });
});