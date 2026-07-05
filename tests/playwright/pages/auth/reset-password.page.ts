import { expect } from "@playwright/test";
import { BasePage } from "../base.page";

type ResetPasswordPayload = {
  password: string;
  confirmPassword: string;
};

export class ResetPasswordPage extends BasePage {
  /* -------------------------------------------------------------------------- */
  /*                                   Locators                                 */
  /* -------------------------------------------------------------------------- */
  readonly heading = this.page.getByRole("heading", {
    name: /restablecer contraseña/i,
  });

  readonly passwordInput = this.page.locator("#reset-password-password-input");

  readonly confirmPasswordInput = this.page.locator(
    "#reset-password-confirm-password-input",
  );

  readonly submitButton = this.page.locator("#reset-password-submit-button");

  readonly passwordToggleButton = this.page.locator(
    "#reset-password-toggle-password-button",
  );

  /* -------------------------------------------------------------------------- */
  /*                                  Navigation                                */
  /* -------------------------------------------------------------------------- */

  public async goto(url: string) {
    await this.page.goto(url);
    await this.expectLoaded();
  }

  public async waitUntilReady() {
    await this.waitForUrl(/\/reset-password\?token=/);
    await super.waitUntilReady();
  }
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

  public async submitWithEnter() {
    await this.confirmPasswordInput.press("Enter");
  }

  public async resetPassword(payload: ResetPasswordPayload) {
    await this.fillPassword(payload.password);
    await this.fillConfirmPassword(payload.confirmPassword);
    await this.submit();
  }

  public async togglePasswordVisibility() {
    await this.stableClick(this.passwordToggleButton);
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Assertions                                 */
  /* -------------------------------------------------------------------------- */
  public async expectLoaded() {
    await this.waitUntilReady();

    await expect(this.heading).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordInput).toBeEditable();
    await expect(this.confirmPasswordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeEditable();
    await expect(this.submitButton).toBeVisible();
    await expect(this.submitButton).toBeEnabled();
  }

  public async expectSuccess() {
    await this.expectToast(/contraseña restablecida/i);
  }

  public async expectPasswordVisible() {
    await expect(this.passwordInput).toHaveAttribute("type", "text");
  }

  public async expectPasswordHidden() {
    await expect(this.passwordInput).toHaveAttribute("type", "password");
  }

  public async expectValidationError(message: string | RegExp) {
    await expect(this.page.getByText(message).first()).toBeVisible();
  }
}
