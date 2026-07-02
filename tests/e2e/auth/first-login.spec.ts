import { test, expect } from "@playwright/test";

test.describe("First login", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/_auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: "user-test-id",
            email: "usuario@test.com",
            lastLoginAt: null,
            role: {
              name: "admin",
            },
          },
        }),
      });
    });

    await page.goto("/first-login");
    await page.waitForTimeout(3000);
  });

  test("loads first login page", async ({ page }) => {
    await expect(
      page.getByRole("heading", {
        name: "Establece tu nueva contraseña",
      }),
    ).toBeVisible();

    await expect(
      page.getByText(
        "Este es tu primer inicio de sesión. Por favor crea una nueva contraseña antes de continuar.",
      ),
    ).toBeVisible();
  });

  test("requires password fields", async ({ page }) => {
    await page.getByRole("button", { name: "Continuar" }).click();

    await expect(page.getByText("La contraseña es requerida.")).toBeVisible();
  });

  test("updates password and redirects to dashboard", async ({ page }) => {
    let sessionWasUpdated = false;

    await page.route("**/api/_auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: "user-test-id",
            email: "usuario@test.com",
            lastLoginAt: sessionWasUpdated ? new Date().toISOString() : null,
            role: {
              name: "admin",
            },
          },
        }),
      });
    });

    await page.route("**/api/auth/updatePassword", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          statusCode: 200,
        }),
      });
    });

    await page.route("**/api/auth/updateLastLogIn", async (route) => {
      sessionWasUpdated = true;

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          statusCode: 200,
        }),
      });
    });

    // await page.goto("/first-login");

    await page
      .getByLabel(/contraseña/i)
      .first()
      .fill("Password123!");
    await page.getByLabel(/confirmar/i).fill("Password123!");

    await page.getByRole("button", { name: "Continuar" }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
