import { test, expect } from "@playwright/test";
import { expectToHaveRows } from "../../helpers/table.helper";

test.describe("Employees", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard/employees");
  });

  test("loads employees page", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Empleados" }),
    ).toBeVisible();
  });

  test("loads employees table", async ({ page }) => {
    const table = page.getByTestId("employees-table");

    await expect(table).toBeVisible();

    await expectToHaveRows(table, 2);
  });

  test("button redirects to employee creation page", async ({ page }) => {
    const button = page.getByTestId("add-employee-button");

    await expect(button).toBeVisible();

    await Promise.all([
      page.waitForURL("**/dashboard/employees/employee/new"),
      button.click(),
    ]);

    await expect(page).toHaveURL(/\/dashboard\/employees\/employee\/new/);
  });

  test("shows search input", async ({ page }) => {
    const searchInput = page.getByTestId("employees-search-input");

    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEditable();
  });

  test("filters employees by search input", async ({ page }) => {
    const searchInput = page.getByTestId("employees-search-input");

    await searchInput.fill("Admin");

    const table = page.getByTestId("employees-table");

    await expectToHaveRows(table, 2);
  });

  test("shows empty state when search has no results", async ({ page }) => {
    const searchInput = page.getByTestId("employees-search-input");

    await searchInput.fill("zzzz-no-existe-123");

    const table = page.getByTestId("employees-table");

    await expectToHaveRows(table, 1);
  });

    test("shows no data when search has no results", async ({ page }) => {
    const searchInput = page.getByTestId("employees-search-input");

    await searchInput.fill("zzzz-no-existe-123");

    await expect(
      page.getByText("No data"),
    ).toBeVisible();
  });
});
