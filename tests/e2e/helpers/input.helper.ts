import { expect, type Locator } from "@playwright/test";

export async function fillInput(input: Locator, value: string) {
  await input.click();
  await input.press(
    process.platform === "darwin" ? "Meta+A" : "Control+A"
  );
  await input.press("Backspace");
  await input.pressSequentially(value, { delay: 500 });

  cononsole.log(value)
  await expect(input).toHaveValue(value);
}