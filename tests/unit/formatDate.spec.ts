import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { dayMontYearFormat, formatDate, longDateTimeFormat } from "../../shared/utils/formatDate";

describe("formatDate utilities", () => {
  const sampleDate = new Date("2025-12-31T15:30:00.000Z");

  test("formatDate returns yyyy-mm-dd", () => {
    assert.equal(formatDate(sampleDate), "2025-12-31");
  });

  test("dayMontYearFormat returns localized day month year", () => {
    const result = dayMontYearFormat(sampleDate);
    assert.match(result, /31.*dic.*2025/i);
  });

  test("longDateTimeFormat returns a localized date-time string", () => {
    const result = longDateTimeFormat(sampleDate);
    assert.ok(result.includes("2025"));
  });
});
