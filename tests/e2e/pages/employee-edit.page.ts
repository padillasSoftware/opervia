import { expect, type Locator, type Page } from "@playwright/test";
import type { EmployeeFormData } from "./employee-create.page";

export class EmployeeEditPage {
  constructor(private readonly page: Page) {}

  readonly emailInput = this.page.locator("#employee-email");
  readonly firstNameInput = this.page.locator("#employee-firstName");
  readonly lastNameInput = this.page.locator("#employee-lastName");
  readonly roleSelect = this.page.locator("#employee-role");
  readonly positionSelect = this.page.locator("#employee-position");
  readonly salaryInput = this.page.locator("#employee-salary");
  readonly hireDateInput = this.page.locator("#employee-hireDate");

  readonly saveButton = this.page.locator("#employee-save-button");
  readonly cancelButton = this.page.locator("#employee-cancel-button");

  async goto(employeeId: string) {
    await this.page.goto(`/dashboard/employees/employee/${employeeId}`);

    await expect(
      this.page.getByRole("heading", {
        name: /editar empleado/i,
      }),
    ).toBeVisible();
  }

  async expectLoaded() {
    await expect(this.emailInput).toBeEditable();
    await expect(this.firstNameInput).toBeEditable();
    await expect(this.lastNameInput).toBeEditable();
    await expect(this.roleSelect).toBeVisible();
    await expect(this.positionSelect).toBeVisible();
    await expect(this.salaryInput).toBeEditable();
    await expect(this.hireDateInput).toBeEditable();
    await expect(this.saveButton).toBeEnabled();
    await expect(this.cancelButton).toBeVisible();
  }
  async waitForEmployeeInformation(employee: EmployeeFormData) {
    await expect(this.emailInput).toHaveValue(employee.email);
    await expect(this.firstNameInput).toHaveValue(employee.firstName);
    await expect(this.lastNameInput).toHaveValue(employee.lastName);
    await expect(this.salaryInput).toHaveValue(employee.salary);
    await expect(this.hireDateInput).toHaveValue(employee.hireDate);
  }

  async expectEmployeeInformation(employee: EmployeeFormData) {
    await expect(this.emailInput).toHaveValue(employee.email);
    await expect(this.firstNameInput).toHaveValue(employee.firstName);
    await expect(this.lastNameInput).toHaveValue(employee.lastName);
    await expect(this.salaryInput).toHaveValue(employee.salary);
    await expect(this.hireDateInput).toHaveValue(employee.hireDate);
    await expect(this.roleSelect).toContainText(employee.role);
    await expect(this.positionSelect).toContainText(employee.position);
  }

  async updateSalary(salary: string) {
    await this.fillInput(this.salaryInput, salary);
  }

  async updateFirstName(firstName: string) {
    await this.fillInput(this.firstNameInput, firstName);
  }

  async updateLastName(lastName: string) {
    await this.fillInput(this.lastNameInput, lastName);
  }

  async selectRole(role: string) {
    await this.openSelect(this.roleSelect);

    const option = this.page.getByRole("option", {
      name: role,
      exact: true,
    });

    await expect(option).toBeVisible();
    await option.click();

    await expect(this.roleSelect).toContainText(role);
  }

  async selectPosition(position: string) {
    await this.openSelect(this.positionSelect);

    const option = this.page.getByRole("option", {
      name: position,
      exact: true,
    });

    await expect(option).toBeVisible();
    await option.click();

    await expect(this.positionSelect).toContainText(position);
  }

  async save() {
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes("/api/admin/employee/") &&
        response.request().method() === "PATCH",
    );

    await this.saveButton.hover();
    await this.saveButton.click({ delay: 100 });

    const response = await responsePromise;

    expect(response.ok()).toBeTruthy();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async expectSalary(salary: string) {
    await expect(this.salaryInput).toHaveValue(salary);
  }

  async expectUpdatedSuccessfully() {
    await expect(
      this.page
        .getByRole("alert")
        .filter({
          hasText: /empleado actualizado correctamente/i,
        })
        .first(),
    ).toBeVisible();
  }

  private async fillInput(input: Locator, value: string) {
    await expect(input).toBeEditable();

    await input.click({ delay: 500 });

    await input.waitFor({
      state: "visible",
    });

    await input.fill("");

    await input.fill("");
    await input.pressSequentially(value, { delay: 500 });

    await expect(input).toHaveValue(value);
  }

  private async openSelect(select: Locator) {
    await expect(select).toBeVisible();
    await expect(select).toBeEnabled();

    await select.hover();
    await select.click({ delay: 100 });
  }
}
