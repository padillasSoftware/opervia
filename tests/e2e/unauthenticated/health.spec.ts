import { expect, test } from "@playwright/test";

test.describe("@smoke @remote-smoke Health endpoint", () => {
  test("returns ok status and database reachable", async ({ request }) => {
    const response = await request.get("/api/health");

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.statusCode).toBe(200);
    expect(body.data).toBeTruthy();
    expect(body.data.status).toBe("ok");
    expect(body.data.database).toBe("ok");
    expect(body.data.stage).toBeTruthy();
  });
});
