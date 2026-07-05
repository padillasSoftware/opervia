import { expect, test } from "@playwright/test";
import { UserApi } from "../../../playwright/api/user.api";
import { UserFactory } from "../../../playwright/factories/user.factory";
import { FirstLoginPage } from "../../../playwright/pages/auth/first-login.page";
import { SignInPage } from "../../../playwright/pages/auth/signin.page";
import { DashboardPage } from "../../../playwright/pages/dashboard/dashboard.page";


test.describe("@smoke Authenticated auth", () => {
  test("first-login user updates password and last login", async ({ page, request }) => {
    const user = UserFactory.firstLoginUser();
    const userApi = new UserApi(request);

    await userApi.createFirstLoginUser(user);

    const signInPage = new SignInPage(page);
    const firstLoginPage = new FirstLoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await signInPage.goto();
    await signInPage.signIn(user);

    await firstLoginPage.expectLoaded();

    const newPassword = UserFactory.validPassword();
    await firstLoginPage.updatePassword({
      password: newPassword,
      confirmPassword: newPassword,
    });

    await firstLoginPage.expectSuccess();
    await dashboardPage.expectLoaded();

    // Verify the user is redirected to dashboard and can see the authenticated page.
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
