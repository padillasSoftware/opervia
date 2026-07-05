import { test } from "@playwright/test";
import { TestUsers } from "../../../playwright/config/users";
import { SignInPage } from "../../../playwright/pages/auth/signin.page";
import { FirstLoginPage } from "../../../playwright/pages/auth/first-login.page";
import { DashboardPage } from '../../../playwright/pages/dashboard/dashboard.page';

test.describe("@smoke Sign In", () => {
  test("loads sign in page", async ({ page }) => {
    const signInPage = new SignInPage(page);

    await signInPage.goto();
  });

  test("redirects first-time users to first login", async ({ page }) => {
    const signInPage = new SignInPage(page);
    const firstLoginPage = new FirstLoginPage(page);

    await signInPage.goto();

    await signInPage.signIn(TestUsers.firstLoginUser);
    // await page.pause();
    await firstLoginPage.expectLoaded();
  });

  test("redirects returning users to dashboard", async ({ page }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);

    await signInPage.goto();
    await signInPage.signIn(TestUsers.activeUser);

    await dashboardPage.expectLoaded();
  });

  test("prevents sign in with invalid credentials", async ({ page }) => {
    const signInPage = new SignInPage(page);

    await signInPage.goto();

    await signInPage.signIn({
      email: "invalid@maelmar.com",
      password: "WrongPassword123!",
    });

    await signInPage.expectInvalidCredentials();
  });

  test("requires email", async ({ page }) => {
    const signInPage = new SignInPage(page);

    await signInPage.goto();

    await signInPage.fillPassword("Password123!");
    await signInPage.submit();

    await signInPage.expectValidationError(/correo.*requerido/i);
  });

  test("requires password", async ({ page }) => {
    const signInPage = new SignInPage(page);

    await signInPage.goto();

    await signInPage.fillEmail(TestUsers.activeUser.email);
    await signInPage.submit();

    await signInPage.expectValidationError(/contraseña.*requerida/i);
  });

  test("requires valid email format", async ({ page }) => {
    const signInPage = new SignInPage(page);

    await signInPage.goto();

    await signInPage.fillEmail("invalid-email");
    await signInPage.fillPassword("Password123!");
    await signInPage.submit();

    await signInPage.expectValidationError(/correo.*válido|email.*valid/i);
  });
});
