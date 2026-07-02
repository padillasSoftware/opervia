import { expect, test } from "@playwright/test";

 test.use({
    storageState: "playwright/.auth/superadmin.json",
  });

test("employees page loads", async ({ page }) => {
  await page.goto("/dashboard/employees");

  await expect(page).toHaveURL(/dashboard\/employees/);

  await expect(
    page.getByRole("heading", { name: /empleados/i })
  ).toBeVisible();
});

test("create employee page loads", async ({ page }) => {
  await page.goto("/dashboard/employees/employee/new");

  await expect(page).toHaveURL(/dashboard\/employees\/employee\/new/);

  await expect(
    page.getByRole("heading", { name: /crear empleado|nuevo empleado/i })
  ).toBeVisible();

});

// test("employee edit flow is reachable", async ({ page }) => {
//   await page.goto("/dashboard/employees");

//   await expect(
//     page.getByRole("heading", { name: /empleados/i })
//   ).toBeVisible();

//   const editLink = page
//     .getByRole("link", { name: /editar|ver detalle|detalle/i })
//     .first();

//   await expect(editLink).toBeVisible();

//   await editLink.click();

//   await expect(page).toHaveURL(/dashboard\/employees\/.+/);
// });