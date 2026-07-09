import { expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class EmployeesListPage extends BasePage {
  /* -------------------------------------------------------------------------- */
  /*                                   Locators                                 */
  /* -------------------------------------------------------------------------- */
  readonly heading = this.page.getByRole("heading", {
    name: /empleados/i,
  });

  readonly employeeTable = this.page.getByTestId("employees-table");

  readonly searchInput = this.page.getByTestId("employees-search-input");

  readonly addButton = this.page.getByTestId("add-employee-button");
  /* -------------------------------------------------------------------------- */
  /*                                  Navigation                                */
  /* -------------------------------------------------------------------------- */
  public async goto() {
    await this.page.goto("/dashboard/employees");
    await this.waitForUrl("/dashboard/employees");

    await this.waitUntilReady();
  }

  public override async waitUntilReady() {
    await super.waitUntilReady();
  }
  /* -------------------------------------------------------------------------- */
  /*                                   Actions                                  */
  /* -------------------------------------------------------------------------- */

  public async fillSearchInput(value: string) {
    await this.stableFill(this.searchInput, value);
  }
  /* -------------------------------------------------------------------------- */
  /*                                 Assertions                                 */
  /* -------------------------------------------------------------------------- */
  public async expectLoaded() {
    await this.expectLoadedHeading();
    await this.expectLoadedTable();
    await this.expectLoadedSearchInput();
    await this.expectLoadedAddButton();
  }

  public async expectLoadedTable() {
    await expect(this.employeeTable).toBeVisible();
  }

  public async expectLoadedSearchInput() {
    await expect(this.searchInput).toBeVisible();
  }

  public async expectLoadedAddButton() {
    await expect(this.addButton).toBeVisible();
  }

  public async expectLoadedHeading() {
    await expect(this.heading).toBeVisible();
  }

  public async expectHaveRecords(value: number) {
    const table = this.employeeTable;
    const rows = table.locator("tbody > tr");

    const count = await rows.count();

    expect(count).toBeGreaterThan(value);
  }

    public async expectNotHaveRecords() {
    const table = this.employeeTable;
    const rows = table.locator("tbody > tr");

    await expect(rows.getByText("No hay empleados")).not.toBeVisible();
  }
}
