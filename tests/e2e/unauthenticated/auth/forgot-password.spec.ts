import { test } from "@playwright/test";
import { TestUsers } from "../../../playwright/config/users";
import { ForgotPasswordPage } from "../../../playwright/pages/auth/forgot-password.page";
import { SignInPage } from "../../../playwright/pages/auth/signin.page";


test.describe("@smoke ", () => {
  test("loads forgot password page", async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();
  });

  test("returns to sign in page", async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);
    const signInPage = new SignInPage(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.goToSignIn();

    await signInPage.expectLoaded();
  });
});

test.describe("@validation ", () => {
  test("requires email", async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.submit();

    await forgotPasswordPage.expectValidationError(/correo.*obligatorio/i);
  });

  test("requires valid email format", async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.fillEmail("correo-invalido");
    await forgotPasswordPage.submit();

    await forgotPasswordPage.expectValidationError(
      /ingresa un correo electrónico válido./i,
    );
  });
});

test.describe("@ux ", () => {
  test("sends password recovery email", async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();

    await forgotPasswordPage.requestPasswordReset(TestUsers.firstLoginUser.email);

    await forgotPasswordPage.expectSuccess();
  });
});
