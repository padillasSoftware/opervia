import { expect, type Locator } from "@playwright/test";
import { expect, type Locator } from "@playwright/test";
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
  readonly passwordToggleButton = this.page.locator(
    "#first-login-toggle-password-button",
  );

  readonly minLengthRequirement = this.page.getByTestId(
    "password-requirement-min-length",
  );

  readonly uppercaseRequirement = this.page.getByTestId(
    "password-requirement-uppercase",
  );

  readonly numberRequirement = this.page.getByTestId(
    "password-requirement-number",
  );
  readonly passwordToggleButton = this.page.locator(
    "#first-login-toggle-password-button",
  );

  readonly minLengthRequirement = this.page.getByTestId(
    "password-requirement-min-length",
  );

  readonly uppercaseRequirement = this.page.getByTestId(
    "password-requirement-uppercase",
  );

  readonly numberRequirement = this.page.getByTestId(
    "password-requirement-number",
  );

  readonly heading = this.page.getByRole("heading", {
    name: /Establece tu nueva contraseña/i,
  });

  readonly backLink = this.page.locator("#back-link");

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
  public async submitWithEnter() {
    await this.confirmPasswordInput.press("Enter");
  }

  public async togglePasswordVisibility() {
    await this.stableClick(this.passwordToggleButton);
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

  public async expectPasswordVisible() {
    await expect(this.passwordInput).toHaveAttribute("type", "text");
  }

  public async expectPasswordHidden() {
    await expect(this.passwordInput).toHaveAttribute("type", "password");
  }
  public async expectRequirementInvalid(requirement: Locator) {
    await expect(requirement).toHaveAttribute("data-valid", "false");
  }

  public async expectRequirementValid(requirement: Locator) {
    await expect(requirement).toHaveAttribute("data-valid", "true");
  }

  public async expectBackLinkVisible() {
    await expect(this.backLink).toBeVisible();
  }
}
