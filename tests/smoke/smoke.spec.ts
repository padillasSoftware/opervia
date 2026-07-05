import { test } from "@playwright/test";
import { TestUsers } from "../playwright/config/users";
import { FirstLoginPage } from "../playwright/pages/auth/first-login.page";
import { SignInPage } from "../playwright/pages/auth/signin.page";
import { DashboardPage } from "../playwright/pages/dashboard/dashboard.page";
import { UserApi } from "../playwright/api/user.api";
import { UserFactory } from "../playwright/factories/user.factory";

test.describe("@smoke Smoke Testing", () => {
  test("loads sign in page", async ({ page }) => {

    const signInPage = new SignInPage(page);

    await signInPage.goto();
  });

  test("returning user can sign in and see dashboard", async ({ page }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);

    await signInPage.goto();
    await signInPage.signIn(TestUsers.activeUser);

    await dashboardPage.expectLoaded();
  });

  test("first-time user is redirected to first login", async ({ page, request }) => {
    const user = UserFactory.firstLoginUser();
    const userApi = new UserApi(request);

    await userApi.createFirstLoginUser(user);

    const signInPage = new SignInPage(page);
    const firstLoginPage = new FirstLoginPage(page);

    await signInPage.goto();
    await signInPage.signIn(user);

    await firstLoginPage.expectLoaded();
  });
});
