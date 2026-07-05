import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { errors, getErrorMessage } from "../../shared/utils/errorsMessages";

describe("errorsMessages utilities", () => {
  test("getErrorMessage returns a message for known error code", () => {
    assert.equal(getErrorMessage("INVALID_CREDENTIALS"), errors.INVALID_CREDENTIALS);
  });

  test("getErrorMessage returns server error for unknown code", () => {
    assert.equal(getErrorMessage("UNDEFINED_CODE"), errors.SERVER_ERROR);
  });
});
