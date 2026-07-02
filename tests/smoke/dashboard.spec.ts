import { expect, test } from "@playwright/test";

 test.use({
    storageState: "playwright/.auth/superadmin.json",
  });

test("dashboard loads for super admin", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/dashboard/);

  await expect(
    page.getByRole("heading", { name: /inicio|dashboard/i })
  ).toBeVisible();
});