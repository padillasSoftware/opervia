import { expect, test } from "@playwright/test";
import { createEmployeeFactory } from "../../factories/employee.factory";
import { EmployeeCreatePage } from "../../pages/employee-create.page";

test.describe("Create employee", () => {
  test("loads create employee page", async ({ page }) => {
    const employeePage = new EmployeeCreatePage(page);

    await employeePage.goto();
    await employeePage.expectInputsVisible();
  });

  test("fills basic employee information", async ({ page }) => {
    const employeePage = new EmployeeCreatePage(page);
    const employee = createEmployeeFactory();

    await employeePage.goto();
    await employeePage.fillBasicInformation(employee);
    await employeePage.expectBasicInformation(employee);
  });

  test("shows validation errors when submitting empty form", async ({
    page,
  }) => {
    const employeePage = new EmployeeCreatePage(page);

    await employeePage.goto();
    await employeePage.save();

    await employeePage.expectValidationErrors();
  });

  test("cancel returns to employees page", async ({ page }) => {
    const employeePage = new EmployeeCreatePage(page);

    await employeePage.goto();
    await employeePage.cancel();

    await expect(page).toHaveURL(/\/dashboard\/employees/);
  });

  test.only("creates employee successfully using UI selects", async ({
    page,
  }) => {
    const employeePage = new EmployeeCreatePage(page);
    const employee = createEmployeeFactory();

    await employeePage.goto();



    await employeePage.selectRole("Empleado");
    await employeePage.selectPosition("Terapeuta");

    await employeePage.fillBasicInformation(employee);

    await employeePage.save();

    await employeePage.expectCreatedSuccessfully();
  });
});
