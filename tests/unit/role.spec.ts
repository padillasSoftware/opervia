import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { getRoleName, roleNames } from "../../shared/utils/role";

describe("role utilities", () => {
  test("getRoleName returns label for known role", () => {
    assert.equal(getRoleName("SUPER_ADMIN"), roleNames.SUPER_ADMIN);
  });

  test("getRoleName returns input when role is unknown", () => {
    assert.equal(getRoleName("UNKNOWN_ROLE"), "UNKNOWN_ROLE");
  });
});
