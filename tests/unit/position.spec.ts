import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { getPositionName, getPositionOptions, positionNames } from "../../shared/utils/position";

describe("position utilities", () => {
  test("getPositionName returns label for known position", () => {
    assert.equal(getPositionName("THERAPIST"), positionNames.THERAPIST);
  });

  test("getPositionName returns empty string for undefined position", () => {
    assert.equal(getPositionName(undefined), "");
  });

  test("getPositionOptions returns all positions", () => {
    const options = getPositionOptions();
    assert.equal(options.length, Object.keys(positionNames).length);
    assert.equal(typeof options[0].id, "string");
    assert.equal(typeof options[0].label, "string");
  });
});
