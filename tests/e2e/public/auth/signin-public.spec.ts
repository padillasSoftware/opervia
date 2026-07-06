import { expect, test } from "@playwright/test";
import { TestUsers } from "../../../playwright/config/users";
import { SignInPage } from "../../../playwright/pages/auth/signin.page";
import { DashboardPage } from "../../../playwright/pages/dashboard/dashboard.page";

test.describe("@smoke Public auth", () => {
  test("sign in page loads and redirects returning user to dashboard", async ({ page }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);

    await signInPage.goto();
    await signInPage.signIn(TestUsers.activeUser);

    await dashboardPage.expectLoaded();
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
