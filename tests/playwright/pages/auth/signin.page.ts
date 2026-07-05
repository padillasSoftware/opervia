import { expect } from "@playwright/test";
import { BasePage } from "../base.page";

type SignInCredentials = {
  email: string;
  password: string;
};

export class SignInPage extends BasePage {
  /* -------------------------------------------------------------------------- */
  /*                                   Locators                                 */
  /* -------------------------------------------------------------------------- */

  readonly emailInput = this.page.locator("#signin-email-input");
  readonly passwordInput = this.page.locator("#signin-password-input");

  readonly submitButton = this.page.getByRole("button", {
    name: /iniciar sesión|sign in|entrar/i,
  });

  readonly forgotPasswordLink = this.page.getByRole("link", {
    name: /olvidaste|recuperar|forgot/i,
  });

  /* -------------------------------------------------------------------------- */
  /*                                  Navigation                                */
  /* -------------------------------------------------------------------------- */

  public async goto() {
    await this.page.goto("/signin");
    await this.waitForUrl(/\/signin/);

    await this.waitUntilReady();
  }

  public override async waitUntilReady() {
    await super.waitUntilReady();

    await this.expectLoaded();
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Actions                                  */
  /* -------------------------------------------------------------------------- */

  public async fillEmail(email: string) {
    await this.stableFill(this.emailInput, email);
  }

  public async fillPassword(password: string) {
    await this.stableFill(this.passwordInput, password);
  }

  public async signIn(credentials: SignInCredentials) {
    // await this.page.pause();
    await this.fillEmail(credentials.email);
    await this.fillPassword(credentials.password);
    await this.submit();
  }

  public async submit() {
    await this.stableClick(this.submitButton);
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Assertions                                 */
  /* -------------------------------------------------------------------------- */

  public async expectLoaded() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.emailInput).toBeEditable();

    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordInput).toBeEditable();

    await expect(this.submitButton).toBeVisible();
    await expect(this.submitButton).toBeEnabled();
  }

  public async expectFirstLogin() {
    await expect(this.page).toHaveURL(/\/first-login/);
  }

  public async expectDashboard() {
    await expect(this.page).toHaveURL(/\/dashboard/);
  }

  public async expectValidationError(message: string | RegExp) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  public async expectInvalidCredentials() {
    await this.expectToast(/credenciales|incorrect/i);
  }
}
