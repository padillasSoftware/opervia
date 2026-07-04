import { expect, test } from "@playwright/test";
import { createEmployeeByApi } from "../../helpers/employee/create-employee.helper";
import { EmployeeEditPage } from "../../pages/employee-edit.page";
import type { EmployeeFormData } from "../../pages/employee-create.page";

test.describe("Edit employee", () => {
  let employeeId: string;
  let employee: EmployeeFormData;

  test.beforeEach(async ({ request }) => {
    const created = await createEmployeeByApi(request);

    employeeId = created.id;
    employee = created.employee;
  });

  test("loads edit employee page", async ({ page }) => {
    const editPage = new EmployeeEditPage(page);

    await editPage.goto(employeeId);
    await editPage.expectLoaded();
  });

  test("loads employee information", async ({ page }) => {
    const editPage = new EmployeeEditPage(page);

    await editPage.goto(employeeId);
    await editPage.expectEmployeeInformation(employee);
  });

  test("updates employee salary", async ({ page }) => {
    const editPage = new EmployeeEditPage(page);

    await editPage.goto(employeeId);

    await editPage.updateSalary("18000");
    await editPage.expectSalary("18000");

    await editPage.save();
    await editPage.expectUpdatedSuccessfully();

    await editPage.goto(employeeId);
    await editPage.expectSalary("18000");
  });

  test("updates employee name", async ({ page }) => {
    const editPage = new EmployeeEditPage(page);

    await editPage.goto(employeeId);

    await editPage.updateFirstName("Carlos");
    await editPage.updateLastName("Ramírez");

    await editPage.save();
    await editPage.expectUpdatedSuccessfully();

    await editPage.goto(employeeId);

    await expect(editPage.firstNameInput).toHaveValue("Carlos");
    await expect(editPage.lastNameInput).toHaveValue("Ramírez");
  });

  test("cancel returns to employees page", async ({ page }) => {
    const editPage = new EmployeeEditPage(page);

    await editPage.goto(employeeId);
    await editPage.cancel();

    await expect(page).toHaveURL(/\/dashboard\/employees/);
  });
});
