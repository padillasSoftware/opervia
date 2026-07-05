import { test } from "@playwright/test";

import { UserApi } from "../../../playwright/api/user.api";
import { UserFactory } from "../../../playwright/factories/user.factory";
import { SignInPage } from "../../../playwright/pages/auth/signin.page";
import { FirstLoginPage } from "../../../playwright/pages/auth/first-login.page";
import { DashboardPage } from "../../../playwright/pages/dashboard/dashboard.page";

test.describe("@smoke First Login", () => {
  test("loads first login page", async ({ page, request }) => {
    const user = UserFactory.firstLoginUser();
    const userApi = new UserApi(request);

    await userApi.createFirstLoginUser(user);

    const signInPage = new SignInPage(page);
    const firstLoginPage = new FirstLoginPage(page);

    await signInPage.goto();
    await signInPage.signIn(user);

    await firstLoginPage.expectLoaded();
  });

  test("updates password successfully", async ({ page, request }) => {
    const user = UserFactory.firstLoginUser();
    const newPassword = UserFactory.validPassword();
    const userApi = new UserApi(request);

    await userApi.createFirstLoginUser(user);

    const signInPage = new SignInPage(page);
    const firstLoginPage = new FirstLoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await signInPage.goto();
    await signInPage.signIn(user);

    await firstLoginPage.expectLoaded();

    await firstLoginPage.updatePassword({
      password: newPassword,
      confirmPassword: newPassword,
    });

    await firstLoginPage.expectSuccess();
    await dashboardPage.expectLoaded();
  });

  test("requires password", async ({ page, request }) => {
    const user = UserFactory.firstLoginUser();
    const userApi = new UserApi(request);

    await userApi.createFirstLoginUser(user);

    const signInPage = new SignInPage(page);
    const firstLoginPage = new FirstLoginPage(page);

    await signInPage.goto();
    await signInPage.signIn(user);

    await firstLoginPage.expectLoaded();

    await firstLoginPage.fillConfirmPassword("Password123!");
    await firstLoginPage.submit();

    await firstLoginPage.expectValidationError(/contraseña.*requerida/i);
  });

  test("requires confirm password", async ({ page, request }) => {
    const user = UserFactory.firstLoginUser();
    const userApi = new UserApi(request);

    await userApi.createFirstLoginUser(user);

    const signInPage = new SignInPage(page);
    const firstLoginPage = new FirstLoginPage(page);

    await signInPage.goto();
    await signInPage.signIn(user);

    await firstLoginPage.expectLoaded();

    await firstLoginPage.fillPassword("Password123!");
    await firstLoginPage.submit();

    await firstLoginPage.expectValidationError(/confirmar.*contraseña|contraseña.*confirmación/i);
  });

  test("prevents password mismatch", async ({ page, request }) => {
    const user = UserFactory.firstLoginUser();
    const userApi = new UserApi(request);

    await userApi.createFirstLoginUser(user);

    const signInPage = new SignInPage(page);
    const firstLoginPage = new FirstLoginPage(page);

    await signInPage.goto();
    await signInPage.signIn(user);

    await firstLoginPage.expectLoaded();

    await firstLoginPage.updatePassword({
      password: "Password123!",
      confirmPassword: "DifferentPassword123!",
    });

    await firstLoginPage.expectValidationError(/contraseñas.*coinciden|no coinciden/i);
  });
});