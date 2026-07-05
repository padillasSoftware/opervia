import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { errorHandler } from "../../shared/utils/errorhandler";

describe("errorHandler utility", () => {
  test("creates an h3 error with expected properties", () => {
    const err = errorHandler(403, 403, "FORBIDDEN", "Forbidden");

    assert.equal(err.statusCode, 403);
    assert.equal(err.statusMessage, "Forbidden");
    assert.deepEqual(err.data, { code: "FORBIDDEN" });
  });
});
