import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { responseHandler } from "../../shared/utils/responseHandler";

describe("responseHandler utility", () => {
  test("returns standard success response shape", () => {
    const result = responseHandler("CODE", "MESSAGE", { id: "1" });

    assert.equal(result.statusCode, 200);
    assert.equal(result.status, 200);
    assert.equal(result.code, "CODE");
    assert.equal(result.message, "MESSAGE");
    assert.equal(result.statusMessage, "MESSAGE");
    assert.deepEqual(result.data, { id: "1" });
  });
});
