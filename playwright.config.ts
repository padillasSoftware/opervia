/// <reference types="node" />

import "dotenv/config";
import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;
const isExternalBaseURL = !!process.env.BASE_URL;

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [["html"], ["github"], ["list"]] : [["html"], ["list"]],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "setup",
      testMatch: "**/auth.setup.ts",
    },
    {
  name: "public",
  testMatch: [
    "**/e2e/public/**/*.spec.ts",
    "**/smoke/public/**/*.spec.ts",
  ],
  use: {
    ...devices["Desktop Chrome"],
    storageState: { cookies: [], origins: [] },
  },
},
{
  name: "authenticated",
  testMatch: [
    "**/e2e/authenticated/**/*.spec.ts",
    "**/smoke/authenticated/**/*.spec.ts",
  ],
  use: {
    ...devices["Desktop Chrome"],
    storageState: "playwright/.auth/superadmin.json",
  },
  dependencies: ["setup"],
},
  ],
  webServer: isExternalBaseURL
    ? undefined
    : {
        command: isCI ? "npx nuxt build && npx nuxt preview" : "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !isCI,
        timeout: 120_000,
      },
});