import { expect, test } from "@playwright/test";
import { UserApi } from "../../playwright/api/user.api";
import { UserFactory } from "../../playwright/factories/user.factory";
import { SignInPage } from "../../playwright/pages/auth/signin.page";
import { FirstLoginPage } from "../../playwright/pages/auth/first-login.page";

test.describe("@smoke Employee forbidden admin access", () => {
  test("employee cannot access admin employees list API", async ({ page, request }) => {
    const user = UserFactory.user();
    const userApi = new UserApi(request);

    await userApi.createUser(user);

    const signInPage = new SignInPage(page);
    const firstLoginPage = new FirstLoginPage(page);

    await signInPage.goto();
    await signInPage.signIn(user);
    await firstLoginPage.expectLoaded();

    const newPassword = UserFactory.validPassword();
    await firstLoginPage.updatePassword({
      password: newPassword,
      confirmPassword: newPassword,
    });
    await firstLoginPage.expectSuccess();
    await page.waitForURL(/dashboard/);

    const response = await page.evaluate(async () => {
      const res = await fetch("/api/admin/employeesList", {
        credentials: "include",
      });
      return res.status;
    });

    expect(response).toBe(403);
  });
});
