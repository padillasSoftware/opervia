import "dotenv/config";

import { mkdirSync } from "node:fs";
import { test as setup } from "@playwright/test";
import { createStorageState } from "./helpers/auth-state.helper";

setup("Generate authentication states", async ({ page }) => {
  mkdirSync("playwright/.auth", { recursive: true });
  const superAdminEmail =
    process.env.STAGING_SUPERADMIN_EMAIL ?? process.env.QA_SUPERADMIN_EMAIL;

  const superAdminPassword =
    process.env.STAGING_SUPERADMIN_PASSWORD ??
    process.env.QA_SUPERADMIN_PASSWORD;

  if (!superAdminEmail || !superAdminPassword) {
    throw new Error("Missing Super Admin credentials.");
  }

  const isStaging =
    process.env.STAGING_SUPERADMIN_EMAIL &&
    process.env.STAGING_SUPERADMIN_PASSWORD;
    
  await createStorageState(
    page,
    superAdminEmail,
    superAdminPassword,
    "playwright/.auth/superadmin.json",
  );

  if (!isStaging) {
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
  }
});
