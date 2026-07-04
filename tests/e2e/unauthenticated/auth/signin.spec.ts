import { test } from "@playwright/test";
// import { TestUsers } from "../../../playwright/config/users";
import { SignInPage } from "../../../playwright/pages/auth/signin.page";

test.describe("@smoke Sign In", () => {
  test("loads sign in page", async ({ page }) => {
    const signInPage = new SignInPage(page);

    await signInPage.goto();
  });

  // test("allows administrator to sign in", async ({ page }) => {
  //   const signInPage = new SignInPage(page);

  //   await signInPage.goto();

  //   await signInPage.signIn(TestUsers.admin);

  //   await signInPage.expectDashboard();
  // });

  // test("prevents sign in with invalid credentials", async ({ page }) => {
  //   const signInPage = new SignInPage(page);

  //   await signInPage.goto();

  //   await signInPage.signIn({
  //     email: "invalid@maelmar.com",
  //     password: "WrongPassword123!",
  //   });

  //   await signInPage.expectInvalidCredentials();
  // });

  // test("requires email", async ({ page }) => {
  //   const signInPage = new SignInPage(page);

  //   await signInPage.goto();

  //   await signInPage.fillPassword("Password123!");
  //   await signInPage.submit();

  //   await signInPage.expectValidationError(/correo.*requerido/i);
  // });

  // test("requires password", async ({ page }) => {
  //   const signInPage = new SignInPage(page);

  //   await signInPage.goto();

  //   await signInPage.fillEmail(TestUsers.admin.email);
  //   await signInPage.submit();

  //   await signInPage.expectValidationError(/contraseña.*requerida/i);
  // });

  // test("requires valid email format", async ({ page }) => {
  //   const signInPage = new SignInPage(page);

  //   await signInPage.goto();

  //   await signInPage.fillEmail("invalid-email");
  //   await signInPage.fillPassword("Password123!");
  //   await signInPage.submit();

  //   await signInPage.expectValidationError(/correo.*válido|email.*valid/i);
  // });
});