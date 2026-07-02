import { test, expect } from "@playwright/test";
import { login } from "../helpers/auth.helper";

test.describe("Sign in", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signin");
    await login(page, "wrong@email.com", "wrong-password");
    await page.waitForTimeout(3000);
  });

 test('shows error with invalid credentials', async ({ page }) => {
    await login(page, 'wrong@email.com', 'wrong-password')

    await expect(
      page.getByText('Error al iniciar sesión', { exact: true })
    ).toBeVisible()
  })
});
