import { test } from "@playwright/test";
import { SignInPage } from "../../../playwright/pages/auth/signin.page";
import { TestUsers } from "../../../playwright/config/users";
import { EmployeesListPage } from "../../../playwright/pages/employees/employees-list.page";
import { DashboardPage } from "../../../playwright/pages/dashboard/dashboard.page";

test.describe("@smoke ", () => {
  test("load employees list page", async ({ page }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesListPage(page);

    await signInPage.goto();
    await signInPage.signIn(TestUsers.activeUser);

    await dashboardPage.expectLoaded();

    await employeesPage.goto();
    await employeesPage.expectLoaded();
  });

  test("employees table have records", async ({ page }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesListPage(page);

    await signInPage.goto();
    await signInPage.signIn(TestUsers.activeUser);

    await dashboardPage.expectLoaded();

    await employeesPage.goto();
    await employeesPage.expectLoaded();

    await employeesPage.expectHaveRecords(2);
  });
});

test.describe("@validation ", () => {});

test.describe("@ux ", () => {
  test("load employees table", async ({ page }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesListPage(page);

    await signInPage.goto();
    await signInPage.signIn(TestUsers.activeUser);

    await dashboardPage.expectLoaded();

    await employeesPage.goto();
    await employeesPage.expectLoadedTable();
  });

  test("load employees table filtered by admin word", async ({ page }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesListPage(page);

    await signInPage.goto();
    await signInPage.signIn(TestUsers.activeUser);

    await dashboardPage.expectLoaded();

    await employeesPage.goto();
    await employeesPage.expectLoadedTable();

    await employeesPage.fillSearchInput("admin");

    await employeesPage.expectHaveRecords(3);
  });

  test("load employees table filtered by manager word", async ({
    page,
  }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesListPage(page);

    await signInPage.goto();
    await signInPage.signIn(TestUsers.activeUser);

    await dashboardPage.expectLoaded();

    await employeesPage.goto();
    await employeesPage.expectLoadedTable();

    await employeesPage.fillSearchInput("manager");

    await employeesPage.expectHaveRecords(1);
  });

  test("load employees table filtered by no exists word", async ({
    page,
  }) => {
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeesPage = new EmployeesListPage(page);

    await signInPage.goto();
    await signInPage.signIn(TestUsers.activeUser);

    await dashboardPage.expectLoaded();

    await employeesPage.goto();
    await employeesPage.expectLoadedTable();

    await employeesPage.fillSearchInput("manager");

    await employeesPage.expectNotHaveRecords();
  });
});
