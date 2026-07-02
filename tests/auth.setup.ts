import "dotenv/config";

import { mkdirSync } from "node:fs";
import { test as setup } from "@playwright/test";
import { createStorageState } from "./helpers/auth-state.helper";

setup("Generate authentication states", async ({ page }) => {
  mkdirSync("playwright/.auth", { recursive: true });

  await createStorageState(
    page,
    process.env.QA_SUPERADMIN_EMAIL!,
    process.env.QA_SUPERADMIN_PASSWORD!,
    "playwright/.auth/superadmin.json",
  );

  await createStorageState(
    page,
    process.env.QA_MANAGER_EMAIL!,
    process.env.QA_MANAGER_PASSWORD!,
    "playwright/.auth/manager.json",
  );

  await createStorageState(
    page,
    process.env.QA_EMPLOYEE_EMAIL!,
    process.env.QA_EMPLOYEE_PASSWORD!,
    "playwright/.auth/employee.json",
  );
});



// setup("authenticate as super admin", async ({ page }) => {
//   mkdirSync("playwright/.auth", { recursive: true });

//   const response = await page.request.post("/api/auth/signin", {
//     data: {
//       email: process.env.QA_SUPERADMIN_EMAIL!,
//       password: process.env.QA_SUPERADMIN_PASSWORD!,
//     },
//   });

//   expect(response.status()).toBe(200);
// //   expect(response.ok()).toBeTruthy();
//   await page.goto("/dashboard");

//   await expect(page).not.toHaveURL(/signin/);

//   await page.context().storageState({
//     path: "playwright/.auth/superadmin.json",
//   });
// });