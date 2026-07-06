import { expect } from "@playwright/test";
import { BasePage } from "../base.page";

export class ForgotPasswordPage extends BasePage {
  /* -------------------------------------------------------------------------- */
  /*                                   Locators                                 */
  /* -------------------------------------------------------------------------- */
  readonly heading = this.page.getByRole("heading", {
    name: /recuperar contraseña|olvidaste tu contraseña/i,
  });

  readonly emailInput = this.page.locator("#forgot-password-email-input");
  readonly submitButton = this.page.locator("#forgot-password-submit-button");
  readonly signInLink = this.page.locator("#forgot-password-signin-link");

  /* -------------------------------------------------------------------------- */
  /*                                  Navigation                                */
  /* -------------------------------------------------------------------------- */
  public async goto() {
    await this.page.goto("/forgot-password");
    await this.waitUntilReady();
    await this.expectLoaded();
  }

  public override async waitUntilReady() {
    await this.waitForUrl(/\/forgot-password/);
    await super.waitUntilReady();
  }

  public async goToSignIn() {
    await this.stableClick(this.signInLink);
  }
  /* -------------------------------------------------------------------------- */
  /*                                   Actions                                  */
  /* -------------------------------------------------------------------------- */

  public async fillEmail(email: string) {
    await this.stableFill(this.emailInput, email);
  }

  public async submit() {
    await this.stableClick(this.submitButton);
  }

  public async requestPasswordReset(email: string) {
    await this.fillEmail(email);
    await this.submit();
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Assertions                                 */
  /* -------------------------------------------------------------------------- */
  public async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.emailInput).toBeEditable();
    await expect(this.submitButton).toBeVisible();
    await expect(this.submitButton).toBeEnabled();
  }

  public async expectValidationError(message: string | RegExp) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  public async expectSuccess() {
    await this.expectToast(/solicitud enviada/i);
  }
}
