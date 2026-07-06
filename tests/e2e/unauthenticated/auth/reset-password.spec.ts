import { test } from "@playwright/test";

import { AuthApi } from "../../../playwright/api/auth.api";
import { UserApi } from "../../../playwright/api/user.api";
import { UserFactory } from "../../../playwright/factories/user.factory";
import { ResetPasswordPage } from "../../../playwright/pages/auth/reset-password.page";
import { SignInPage } from "../../../playwright/pages/auth/signin.page";

test.describe("@smoke Reset Password", () => {
  test("loads reset password page", async ({ page, request }) => {
    const user = UserFactory.user();
    const userApi = new UserApi(request);
    const authApi = new AuthApi(request);
    const resetPasswordPage = new ResetPasswordPage(page);

    await userApi.createUser(user);

    const { url } = await authApi.createResetPasswordUrl(user.email);

    await resetPasswordPage.goto(url);
    await resetPasswordPage.expectLoaded();
  });

  test("updates password successfully", async ({ page, request }) => {
    const user = UserFactory.user();
    const newPassword = UserFactory.validPassword();

    const userApi = new UserApi(request);
    const authApi = new AuthApi(request);
    const resetPasswordPage = new ResetPasswordPage(page);
    const signInPage = new SignInPage(page);

    await userApi.createUser(user);

    const { url } = await authApi.createResetPasswordUrl(user.email);

    await resetPasswordPage.goto(url);

    await resetPasswordPage.resetPassword({
      password: newPassword,
      confirmPassword: newPassword,
    });

    await resetPasswordPage.expectSuccess();
    await signInPage.expectLoaded();
  });
});

test.describe("@validation Reset Password", () => {
  test("requires password", async ({ page, request }) => {
    const user = UserFactory.user();
    const userApi = new UserApi(request);
    const authApi = new AuthApi(request);
    const resetPasswordPage = new ResetPasswordPage(page);

    await userApi.createUser(user);

    const { url } = await authApi.createResetPasswordUrl(user.email);

    await resetPasswordPage.goto(url);

    await resetPasswordPage.fillConfirmPassword("Password123!");
    await resetPasswordPage.submit();

    await resetPasswordPage.expectValidationError(/contraseña es requerida/i);
  });

  test("requires confirm password", async ({ page, request }) => {
    const user = UserFactory.user();
    const userApi = new UserApi(request);
    const authApi = new AuthApi(request);
    const resetPasswordPage = new ResetPasswordPage(page);

    await userApi.createUser(user);

    const { url } = await authApi.createResetPasswordUrl(user.email);

    await resetPasswordPage.goto(url);

    await resetPasswordPage.fillPassword("Password123!");
    await resetPasswordPage.submit();

    await resetPasswordPage.expectValidationError(/confirma tu contraseña/i);
  });

  test("prevents password mismatch", async ({ page, request }) => {
    const user = UserFactory.user();
    const userApi = new UserApi(request);
    const authApi = new AuthApi(request);
    const resetPasswordPage = new ResetPasswordPage(page);

    await userApi.createUser(user);

    const { url } = await authApi.createResetPasswordUrl(user.email);

    await resetPasswordPage.goto(url);

    await resetPasswordPage.resetPassword({
      password: "Password123!",
      confirmPassword: "DifferentPassword123!",
    });

    await resetPasswordPage.expectValidationError(/no coinciden/i);
  });

  test("validates weak password", async ({ page, request }) => {
    const user = UserFactory.user();
    const userApi = new UserApi(request);
    const authApi = new AuthApi(request);
    const resetPasswordPage = new ResetPasswordPage(page);

    await userApi.createUser(user);

    const { url } = await authApi.createResetPasswordUrl(user.email);

    await resetPasswordPage.goto(url);

    await resetPasswordPage.resetPassword({
      password: "123",
      confirmPassword: "123",
    });

    await resetPasswordPage.expectValidationError(
      /contraseña debe tener al menos 8 caracteres/i,
    );
  });
});

test.describe("@ux Reset Password", () => {
  test("submits with Enter", async ({ page, request }) => {
    const user = UserFactory.user();
    const newPassword = UserFactory.validPassword();

    const userApi = new UserApi(request);
    const authApi = new AuthApi(request);
    const resetPasswordPage = new ResetPasswordPage(page);
    const signInPage = new SignInPage(page);

    await userApi.createUser(user);

    const { url } = await authApi.createResetPasswordUrl(user.email);

    await resetPasswordPage.goto(url);

    await resetPasswordPage.fillPassword(newPassword);
    await resetPasswordPage.fillConfirmPassword(newPassword);
    await resetPasswordPage.submitWithEnter();

    await resetPasswordPage.expectSuccess();
    await signInPage.expectLoaded();
  });

  test("toggles password visibility", async ({ page, request }) => {
    const user = UserFactory.user();
    const userApi = new UserApi(request);
    const authApi = new AuthApi(request);
    const resetPasswordPage = new ResetPasswordPage(page);

    await userApi.createUser(user);

    const { url } = await authApi.createResetPasswordUrl(user.email);

    await resetPasswordPage.goto(url);

    await resetPasswordPage.expectPasswordHidden();

    await resetPasswordPage.togglePasswordVisibility();
    await resetPasswordPage.expectPasswordVisible();

    await resetPasswordPage.togglePasswordVisibility();
    await resetPasswordPage.expectPasswordHidden();
  });
});