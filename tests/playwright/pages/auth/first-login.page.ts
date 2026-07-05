import { expect } from "@playwright/test";
import { BasePage } from "../base.page";

type FirstLoginPassword = {
  password: string;
  confirmPassword: string;
};

export class FirstLoginPage extends BasePage {
  /* -------------------------------------------------------------------------- */
  /*                                   Locators                                 */
  /* -------------------------------------------------------------------------- */

  readonly passwordInput = this.page.locator("#first-login-password-input");

  readonly confirmPasswordInput = this.page.locator(
    "#first-login-confirm-password-input",
  );

  readonly submitButton = this.page.locator("#first-login-submit-button");

  readonly heading = this.page.getByRole("heading", {
    name: /Establece tu nueva contraseña/i,
  });

  /* -------------------------------------------------------------------------- */
  /*                                  Navigation                                */
  /* -------------------------------------------------------------------------- */


  /* -------------------------------------------------------------------------- */
  /*                                   Actions                                  */
  /* -------------------------------------------------------------------------- */

  public async fillPassword(password: string) {
    await this.stableFill(this.passwordInput, password);
  }

  public async fillConfirmPassword(password: string) {
    await this.stableFill(this.confirmPasswordInput, password);
  }

  public async submit() {
    await this.stableClick(this.submitButton);
  }

  public async updatePassword(payload: FirstLoginPassword) {
    await this.fillPassword(payload.password);
    await this.fillConfirmPassword(payload.confirmPassword);
    await this.submit();
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Assertions                                 */
  /* -------------------------------------------------------------------------- */

  public async expectLoaded() {
    await super.waitUntilReady();

    await expect(this.heading).toBeVisible();

    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordInput).toBeEditable();

    await expect(this.confirmPasswordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeEditable();

    await expect(this.submitButton).toBeVisible();
    await expect(this.submitButton).toBeEnabled();
  }

  public async expectValidationError(message: string | RegExp) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  public async expectPasswordRequirement(message: string | RegExp) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  public async expectSuccess() {
    await this.expectToast(/contraseña actualizada|actualizada correctamente/i);
  }
}
