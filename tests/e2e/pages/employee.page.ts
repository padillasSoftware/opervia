import { expect, type Page } from "@playwright/test";
import { expectToHaveRows } from "../helpers/table.helper";

export class EmployeeListPage {
  constructor(private readonly page: Page) {}

  readonly heading = this.page.getByRole("heading", { name: "Empleados" });
  readonly table = this.page.getByTestId("employees-table");
  readonly addButton = this.page.getByTestId("add-employee-button");
  readonly searchInput = this.page.getByTestId("employees-search-input");

  async goto() {
    await this.page.goto("/dashboard/employees");
    await expect(this.heading).toBeVisible();
  }

  async expectTableRows(count: number) {
    await expect(this.table).toBeVisible();
    await expectToHaveRows(this.table, count);
  }

  async expectSearchVisible() {
    await expect(this.searchInput).toBeVisible();
  }

  async goToCreate() {
    await expect(this.addButton).toBeVisible();

    await Promise.all([
      this.page.waitForURL("**/dashboard/employees/employee/new"),
      this.addButton.click(),
    ]);
  }

  async search(text: string) {
    await expect(this.searchInput).toBeEditable();
    await this.searchInput.fill(text);
  }

  async expectNoData() {
    await expect(this.page.getByText("No data")).toBeVisible();
  }
}