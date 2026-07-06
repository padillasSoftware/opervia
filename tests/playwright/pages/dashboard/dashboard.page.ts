import { expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class DashboardPage extends BasePage {
  /* -------------------------------------------------------------------------- */
  /*                                   Locators                                 */
  /* -------------------------------------------------------------------------- */

  readonly heading = this.page.getByRole("heading", {
    name: /hola/i,
  });

  /* -------------------------------------------------------------------------- */
  /*                                  Navigation                                */
  /* -------------------------------------------------------------------------- */

  public async goto() {
    await this.page.goto("/signin");
    await this.waitForUrl(/\/signin/);

    await this.waitUntilReady();
  }

  public async gotoFirstLoginWitActiveUser() {
    await this.page.goto("/first-login");
    await this.expectedDashboardPage();
  }

  public override async waitUntilReady() {
    await super.waitUntilReady();

    await this.expectLoaded();
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Actions                                  */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                                 Assertions                                 */
  /* -------------------------------------------------------------------------- */
  public async expectLoaded() {
    await this.waitForUrl(/\/dashboard/);
    await expect(this.heading).toBeVisible();
  }

  public async expectedDashboardPage() {
    await super.waitUntilReady();
  }
}
