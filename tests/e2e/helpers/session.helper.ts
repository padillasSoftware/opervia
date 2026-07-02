import type { Page } from "@playwright/test";

type SessionOptions = {
  id?: string;
  email?: string;
  name?: string;
  centerName?: string;
  role?: string;
  lastLoginAt?: string | null;
  loggedIn?: boolean;
};

export async function mockSession(page: Page, options: SessionOptions = {}) {
  await page.route("**/api/_auth/session", async (route) => {

    console.log("MOCK SESSION HIT", options);

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        loggedIn: options.loggedIn ?? true,
        user: {
          id: options.id ?? "user-test-id",
          email: options.email ?? "usuario@test.com",
          name: options.name ?? "Usuario Test",
          centerName: options.centerName ?? "Centro de prueba",
          lastLoginAt: options.lastLoginAt ?? new Date().toISOString(),
          role: options.role ?? "SUPER_ADMIN",
        },
      }),
    });
  });
}
