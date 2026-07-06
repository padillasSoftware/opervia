import { test } from "@playwright/test";

import { UserApi } from "../../../playwright/api/user.api";
import { UserFactory } from "../../../playwright/factories/user.factory";
import { SignInPage } from "../../../playwright/pages/auth/signin.page";
import { FirstLoginPage } from "../../../playwright/pages/auth/first-login.page";
import { DashboardPage } from "../../../playwright/pages/dashboard/dashboard.page";

test.describe("@smoke First Login", () => {
  test("loads first login page", async ({ page, request }) => {
    const user = UserFactory.user();
    const userApi = new UserApi(request);

    await userApi.createUser(user);

    const signInPage = new SignInPage(page);
    const firstLoginPage = new FirstLoginPage(page);

    await signInPage.goto();
    await signInPage.signIn(user);

    await firstLoginPage.expectLoaded();
  });

  test("updates password successfully", async ({ page, request }) => {
    const user = UserFactory.user();
    const newPassword = UserFactory.validPassword();
    const userApi = new UserApi(request);

    await userApi.createUser(user);

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
});

test.describe("@validation First Login", () => {
  test("requires password", async ({ page, request }) => {
    const user = UserFactory.user();
    const userApi = new UserApi(request);

    await userApi.createUser(user);

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
    const user = UserFactory.user();
    const userApi = new UserApi(request);

    await userApi.createUser(user);

    const signInPage = new SignInPage(page);
    const firstLoginPage = new FirstLoginPage(page);

    await signInPage.goto();
    await signInPage.signIn(user);

    await firstLoginPage.expectLoaded();

    await firstLoginPage.fillPassword("Password123!");
    await firstLoginPage.submit();

    await firstLoginPage.expectValidationError(
      /confirmar.*contraseña|contraseña.*confirmación/i,
    );
  });

  test("prevents password mismatch", async ({ page, request }) => {
    const user = UserFactory.user();
    const userApi = new UserApi(request);

    await userApi.createUser(user);

    const signInPage = new SignInPage(page);
    const firstLoginPage = new FirstLoginPage(page);

    await signInPage.goto();
    await signInPage.signIn(user);

    await firstLoginPage.expectLoaded();

    await firstLoginPage.updatePassword({
      password: "Password123!",
      confirmPassword: "DifferentPassword123!",
    });

    await firstLoginPage.expectValidationError(
      /contraseñas.*coinciden|no coinciden/i,
    );
  });

  test("validates weak password", async ({ page, request }) => {
    const user = UserFactory.user();
    const userApi = new UserApi(request);

    await userApi.createUser(user);

    const signInPage = new SignInPage(page);
    const firstLoginPage = new FirstLoginPage(page);

    await signInPage.goto();
    await signInPage.signIn(user);

    await firstLoginPage.expectLoaded();

    await firstLoginPage.updatePassword({
      password: "123",
      confirmPassword: "123",
    });

    await firstLoginPage.expectRequirementInvalid(
      firstLoginPage.minLengthRequirement,
    );

    await firstLoginPage.expectRequirementValid(
      firstLoginPage.numberRequirement,
    );
  });
});

test.describe("@ux First Login", () => {
  test("submits with Enter", async ({ page, request }) => {
    const user = UserFactory.user();
    const newPassword = UserFactory.validPassword();
    const userApi = new UserApi(request);

    await userApi.createUser(user);

    const signInPage = new SignInPage(page);
    const firstLoginPage = new FirstLoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await signInPage.goto();
    await signInPage.signIn(user);

    await firstLoginPage.expectLoaded();

    await firstLoginPage.fillPassword(newPassword);
    await firstLoginPage.fillConfirmPassword(newPassword);
    await firstLoginPage.submitWithEnter();

    await firstLoginPage.expectSuccess();
    await dashboardPage.expectLoaded();
  });

  test("toggles password visibility", async ({ page, request }) => {
    const user = UserFactory.user();
    const userApi = new UserApi(request);

    await userApi.createUser(user);

    const signInPage = new SignInPage(page);
    const firstLoginPage = new FirstLoginPage(page);

    await signInPage.goto();
    await signInPage.signIn(user);

    await firstLoginPage.expectLoaded();

    await firstLoginPage.expectPasswordHidden();

    await firstLoginPage.togglePasswordVisibility();
    await firstLoginPage.expectPasswordVisible();

    await firstLoginPage.togglePasswordVisibility();
    await firstLoginPage.expectPasswordHidden();
  });

  test("back to sign in page link visible", async ({ page, request }) => {
    const user = UserFactory.user();
    const userApi = new UserApi(request);

    await userApi.createUser(user);

    const signInPage = new SignInPage(page);
    const firstLoginPage = new FirstLoginPage(page);

    await signInPage.goto();
    await signInPage.signIn(user);

    await firstLoginPage.expectLoaded();

    await firstLoginPage.expectBackLinkVisible();
  });
});
