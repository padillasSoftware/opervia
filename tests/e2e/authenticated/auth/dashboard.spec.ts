import { test } from "@playwright/test";

import { TestUsers } from "../../../playwright/config/users";
import { SignInPage } from "../../../playwright/pages/auth/signin.page";
import { DashboardPage } from "../../../playwright/pages/dashboard/dashboard.page";

test.describe("@smoke ", () => {
  test("redirects returning users to dashboard", async ({ page }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);
    console.log("prueba de flujo para la automatizacion");
    await signInPage.goto();
    await signInPage.signIn(TestUsers.activeUser);
    await dashboardPage.expectLoaded();

    await dashboardPage.gotoFirstLoginWitActiveUser();
  });
});
