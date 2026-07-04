import { test } from "@playwright/test";
import { createEmployeeByApi } from "../../helpers/employee/create-employee.helper";
import { EmployeeEditPage } from "../../pages/employee-edit.page";

test.describe("Edit employee", () => {
  let employeeId: string;
  let employee: EmployeeFormData;
  test.beforeAll(async ({ request }) => {
    const { id, employee: employeeDb } = await createEmployeeByApi(request);
    employeeId = id;
    employee = employeeDb;
  });

  test("loads edit employee page", async ({ page }) => {
    const employeeEditPage = new EmployeeEditPage(page);

    await employeeEditPage.goto(employeeId);
    await employeeEditPage.expectLoaded();
  });

  test("loads employee information", async ({ page }) => {
    const editPage = new EmployeeEditPage(page);

    await editPage.goto(employeeId);

    await editPage.expectEmployee(employee);
  });

  test("updates employee salary", async ({ page }) => {
    const editPage = new EmployeeEditPage(page);

    await editPage.goto(employeeId);

    await editPage.updateSalary("18000");
    await editPage.save();

    await editPage.expectUpdatedSuccessfully();

    await editPage.goto(employeeId);
    await editPage.expectSalary("18000");
  });
});
