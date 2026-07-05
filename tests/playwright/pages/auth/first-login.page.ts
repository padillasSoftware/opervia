import { expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class FirstLoginPage extends BasePage {
  readonly heading = this.page.getByRole("heading", {
    name: /primer inicio|actualiza tu contraseña|contraseña/i,
  });

  readonly passwordInput = this.page.locator("#first-login-password-input");
  readonly confirmPasswordInput = this.page.locator(
    "#first-login-confirm-password-input",
  );
  readonly submitButton = this.page.locator("#first-login-submit-button");

  public async expectLoaded() {
    await this.waitForUrl(/\/first-login/);

    await expect(this.heading).toBeVisible();
    await expect(this.passwordInput).toBeEditable();
    await expect(this.confirmPasswordInput).toBeEditable();
    await expect(this.submitButton).toBeVisible();
  }
}
