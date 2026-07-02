import { test, expect } from "@playwright/test";
import { users } from "../../fixtures/users";

test.describe("Dashboard - Super Admin", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("loads dashboard page", async ({ page }) => {

    await expect(
      page.getByRole("heading", {
        name: `Hola ${users.loggedInSuperAdmin.name}`,
      }),
    ).toBeVisible();

    await expect(page.getByText(users.loggedInSuperAdmin.centerName)).toBeVisible();
  });

  test("loads sidebar correctly for super admin role", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Inicio" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Empleados" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Pacientes" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Centros" })).toBeVisible();
  });

  // test.beforeEach(async ({ page }) => {
  //   await mockSession(page, users.loggedInAdmin);

  //   await page.goto("/dashboard");
  //   await page.waitForTimeout(3000);
  // });

  // test("loads dahsboard page", async ({ page }) => {
  //   await expect(
  //     page.getByRole("heading", {
  //       name: `Hola ${users.admin.name}`,
  //     }),
  //   ).toBeVisible();

  //   await expect(page.getByText(`${users.admin.centerName}`)).toBeVisible();
  // });

  // test("loads sidebar correctly for admin role", async ({ page }) => {
  //   await expect(page.getByRole("link", { name: "Inicio" })).toBeVisible();
  //   await expect(page.getByRole("link", { name: "Empleados" })).toBeVisible()
  //   await expect(page.getByRole("link", { name: "Pacientes" })).toBeVisible();
  //   await expect(page.getByRole("link", { name: "Centros" })).toHaveCount(0);
  // });

  // test("loads sidebar correctly for super admin role", async ({ page }) => {
  //   await mockSession(page, users.loggedInSuperAdmin);
  //   await page.goto("/dashboard");
  //   await expect(page.getByRole("link", { name: "Inicio" })).toBeVisible();
  //   await expect(page.getByRole("link", { name: "Empleados" })).toBeVisible()
  //   await expect(page.getByRole("link", { name: "Pacientes" })).toBeVisible();
  //   await expect(page.getByRole("link", { name: "Centros" })).toBeVisible();
  // });

  // test("loads sidebar correctly for employee role", async ({ page }) => {
  //   await mockSession(page, users.loggedInEmployee);
  //   await page.goto("/dashboard");
  //   await expect(page.getByRole("link", { name: "Inicio" })).toBeVisible();
  //   await expect(page.getByRole("link", { name: "Empleados" })).toHaveCount(0)
  //   await expect(page.getByRole("link", { name: "Pacientes" })).toBeVisible();
  //   await expect(page.getByRole("link", { name: "Centros" })).toHaveCount(0);
  // });
});


test.describe("Dashboard - Manager", () => {
  test.use({
    storageState: "playwright/.auth/manager.json",
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("loads sidebar correctly for manager role", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Inicio" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Empleados" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Pacientes" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Centros" })).toHaveCount(0);
  });
});


test.describe("Dashboard - Employee", () => {
  test.use({
    storageState: "playwright/.auth/employee.json",
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("loads sidebar correctly for employee role", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Inicio" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Empleados" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Pacientes" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Centros" })).toHaveCount(0);
  });
});