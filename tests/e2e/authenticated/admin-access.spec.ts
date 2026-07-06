import { test } from "@playwright/test";
import { TestUsers } from "../../playwright/config/users";
import { SignInPage } from "../../playwright/pages/auth/signin.page";
import { DashboardPage } from "../../playwright/pages/dashboard/dashboard.page";

test.describe("@smoke Admin authenticated access", () => {
  test("logged-in admin can access dashboard", async ({ page }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);

    await signInPage.goto();
    await signInPage.signIn(TestUsers.activeUser);

    await dashboardPage.expectLoaded();
  });
});
