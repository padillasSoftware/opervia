import { test } from "@playwright/test";
import { EmployeeListPage } from "../../pages/employee.page";

test.describe("Employees", () => {
  test("loads employees page", async ({ page }) => {
    const employeePage = new EmployeeListPage(page);

    await employeePage.goto();
  });

  test("loads employees table", async ({ page }) => {
    const employeePage = new EmployeeListPage(page);

    await employeePage.goto();
    await employeePage.expectTableRows(2);
  });

  test("button redirects to employee creation page", async ({ page }) => {
    const employeePage = new EmployeeListPage(page);

    await employeePage.goto();
    await employeePage.goToCreate();
  });

  test("shows search input", async ({ page }) => {
    const employeePage = new EmployeeListPage(page);

    await employeePage.goto();
    await employeePage.expectSearchVisible();
  });

  test("filters employees by search input", async ({ page }) => {
    const employeePage = new EmployeeListPage(page);

    await employeePage.goto();
    await employeePage.search("ad");
    await employeePage.expectTableRows(2);
  });

  test("shows empty state when search has no results", async ({ page }) => {
    const employeePage = new EmployeeListPage(page);

    await employeePage.goto();
    await employeePage.search("zzzz-no-existe-123");
    await employeePage.expectTableRows(1);
    await employeePage.expectNoData();
  });
});