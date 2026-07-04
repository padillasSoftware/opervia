import { expect, type Page } from "@playwright/test";
import { openSelect } from "../helpers/select.helper";
import { fillInput } from '../helpers/input.helper'

export type EmployeeFormData = {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  position: string;
  salary: string;
  hireDate: string;
};

export class EmployeeCreatePage {
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

  async goto() {
    await this.page.goto("/dashboard/employees/employee/new");

    await expect(this.page).toHaveURL("/dashboard/employees/employee/new");

    await expect(
      this.page.getByRole("heading", { name: /crear empleado/i }),
    ).toBeVisible();

    await expect(this.page.locator("#employee-create-form")).toBeVisible();

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

    await expect(this.saveButton).toBeEnabled();
  }

  async expectInputsVisible() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.roleSelect).toBeVisible();
    await expect(this.positionSelect).toBeVisible();
    await expect(this.salaryInput).toBeVisible();
    await expect(this.hireDateInput).toBeVisible();
    await expect(this.saveButton).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
  }

  async fillBasicInformation(employee: EmployeeFormData) {
    await fillInput(this.emailInput, employee.email);
    await fillInput(this.firstNameInput, employee.firstName);
    await fillInput(this.lastNameInput, employee.lastName);
    await fillInput(this.salaryInput, employee.salary);
    
    await this.hireDateInput.fill(employee.hireDate);

  }

  async expectBasicInformation(employee: EmployeeFormData) {
    await expect(this.emailInput).toHaveValue(employee.email);
    await expect(this.firstNameInput).toHaveValue(employee.firstName);
    await expect(this.lastNameInput).toHaveValue(employee.lastName);
    await expect(this.salaryInput).toHaveValue(employee.salary);
    await expect(this.hireDateInput).toHaveValue(employee.hireDate);
  }

  async selectRole(role: string) {
    await openSelect(this.roleSelect);

    const option = this.page.getByRole("option", {
      name: role,
      exact: true,
    });

    await expect(option).toBeVisible();
    await option.click();

    await expect(this.roleSelect).toContainText(role);
  }

  async selectPosition(position: string) {
    await openSelect(this.positionSelect);
    const option = this.page.getByRole("option", {
      name: position,
      exact: true,
    });

    await expect(option).toBeVisible();
    await option.click();

    await expect(this.positionSelect).toContainText(position);
  }

  async save() {
    await this.saveButton.click();

    await expect(this.saveButton).toBeEnabled();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async expectValidationErrors() {
    await expect(this.page.locator("p.text-red-600").first()).toBeVisible();

    await expect(this.page.getByText(/el nombre es requerido/i)).toBeVisible();
    await expect(
      this.page.getByText(/el apellido es requerido/i),
    ).toBeVisible();
    await expect(
      this.page.getByText(/el correo electronico es requerido/i),
    ).toBeVisible();
  }

  async expectCreatedSuccessfully() {
    await expect(this.page).toHaveURL(/\/dashboard\/employees\/employee\/.+/);

    await expect(
      this.page.getByRole("alert").filter({
        hasText: /empleado creado correctamente/i,
      }),
    ).toBeVisible();
  }
}
