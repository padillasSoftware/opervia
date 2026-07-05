import { expect, test } from "@playwright/test";
import { UserApi } from "../../playwright/api/user.api";
import { UserFactory } from "../../playwright/factories/user.factory";
import { SignInPage } from "../../playwright/pages/auth/signin.page";
import { FirstLoginPage } from "../../playwright/pages/auth/first-login.page";

test.describe("@smoke Manager access control", () => {
  test("manager cannot create a superadmin employee", async ({ page, request }) => {
    const managerUser = UserFactory.firstLoginUser();
    managerUser.role = "MANAGER";

    const userApi = new UserApi(request);
    await userApi.createFirstLoginUser(managerUser);

    const signInPage = new SignInPage(page);
    const firstLoginPage = new FirstLoginPage(page);

    await signInPage.goto();
    await signInPage.signIn(managerUser);
    await firstLoginPage.expectLoaded();

    const newPassword = UserFactory.validPassword();
    await firstLoginPage.updatePassword({
      password: newPassword,
      confirmPassword: newPassword,
    });
    await firstLoginPage.expectSuccess();
    await page.waitForURL(/dashboard/);

    const response = await page.evaluate(async () => {
      const res = await fetch("/api/admin/employee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName: "No",
          lastName: "Admin",
          position: "Manager",
          email: `manager-fail-${crypto.randomUUID()}@maelmar.test`,
          role: "SUPER_ADMIN",
          centerId: "cmr6vxxwk0004b71bi5o29pt9",
          salary: 1000,
          hireDate: "2025-01-01",
        }),
      });
      const text = await res.text();
      return { status: res.status, text };
    });

    expect(response.status).toBe(403);
  });
});
