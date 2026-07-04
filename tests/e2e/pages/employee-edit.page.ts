import { expect, type Page } from "@playwright/test";
import { fillInput } from '../helpers/input.helper'

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

    await expect(this.page).toHaveURL(
      new RegExp(`/dashboard/employees/employee/${employeeId}`),
    );

    await expect(
      this.page.getByRole("heading", { name: /editar empleado/i }),
    ).toBeVisible();

    await expect(this.emailInput).toBeEditable();
    await expect(this.firstNameInput).toBeEditable();
    await expect(this.lastNameInput).toBeEditable();
    await expect(this.salaryInput).toBeEditable();
    await expect(this.hireDateInput).toBeEditable();

    await expect(this.roleSelect).toBeVisible();
    await expect(this.roleSelect).toBeEnabled();
    await expect(this.roleSelect).toHaveAttribute("data-state", "closed");

    await expect(this.positionSelect).toBeVisible();
    await expect(this.positionSelect).toBeEnabled();
    await expect(this.positionSelect).toHaveAttribute("data-state", "closed");
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

  async expectEmployee(employee: EmployeeFormData) {
    await expect(this.emailInput).toHaveValue(employee.email);
    await expect(this.firstNameInput).toHaveValue(employee.firstName);
    await expect(this.lastNameInput).toHaveValue(employee.lastName);
    await expect(this.salaryInput).toHaveValue(employee.salary);
    await expect(this.hireDateInput).toHaveValue(employee.hireDate);

    await expect(this.roleSelect).toContainText(employee.role);
    await expect(this.positionSelect).toContainText(employee.position);
  }

  async updateSalary(salary: string) {
    await fillInput(this.salaryInput, salary)
  }

  async save() {
    await this.saveButton.click({ delay: 100 });
  }

  async expectUpdatedSuccessfully() {
    await expect(
      this.page.getByRole("alert").filter({
        hasText: /empleado actualizado correctamente/i,
      }),
    ).toBeVisible();
  }

  async expectSalary(salary: string) {
    await expect(this.salaryInput).toHaveValue(salary);
  }
}
