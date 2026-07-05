import { expect, test } from "@playwright/test";

test.describe("@smoke Authorization", () => {
  test("prevents unauthenticated access to admin employee create API", async ({ request }) => {
    const response = await request.post("/api/admin/employee", {
      data: {
        firstName: "Unauthorized",
        lastName: "User",
        position: "THERAPIST",
        email: `unauthorized-${crypto.randomUUID()}@maelmar.test`,
        role: "EMPLOYEE",
        centerId: "invalid-center-id",
        salary: 1000,
        hireDate: "2025-01-01",
      },
    });

    expect(response.status()).toBe(401);
  });

  test("prevents unauthenticated access to admin employees list API", async ({ request }) => {
    const response = await request.get("/api/admin/employeesList");

    expect(response.status()).toBe(401);
  });
});
