import { expect, test } from "@playwright/test";
import { users } from "../e2e/fixtures/users";
// Smoke check for staging dashboard
 test.use({
    storageState: "playwright/.auth/superadmin.json",
  });

test("dashboard loads for super admin", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/dashboard/);

  await expect(
    page.getByRole("heading", { name: `Hola ${users.loggedInSuperAdmin.name}`, })
  ).toBeVisible();
});