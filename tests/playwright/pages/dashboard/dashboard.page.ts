import { expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class DashboardPage extends BasePage {
  readonly heading = this.page.getByRole("heading", {
    name: /hola/i,
  });

  public async expectLoaded() {
    await this.waitForUrl(/\/dashboard/);
    await expect(this.heading).toBeVisible();
  }
}