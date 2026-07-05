import { expect, type Locator, type Page } from "@playwright/test";

type WaitForApiOptions = {
  url: string;
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  status?: number;
};

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /* -------------------------------------------------------------------------- */
  /*                                  Navigation                               */
  /* -------------------------------------------------------------------------- */

  public async waitForUrl(url: string | RegExp) {
    await this.page.waitForURL(url);
  }

  public async waitForNetworkIdle() {
    await this.page.waitForLoadState("networkidle");
  }

  public async waitForApi({
    url,
    method = "GET",
    status = 200,
  }: WaitForApiOptions) {
    await this.page.waitForResponse((response) => {
      return (
        response.url().includes(url) &&
        response.request().method() === method &&
        response.status() === status
      );
    });
  }

  public async waitUntilReady() {
    await this.waitForNetworkIdle();
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Interaction                               */
  /* -------------------------------------------------------------------------- */

  public async stableClick(locator: Locator) {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();

    await locator.hover();
    await locator.click({
      delay: 100,
    });
  }

  public async stableFill(locator: Locator, value: string) {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEditable();

    await locator.click({ delay: 100 });
    await locator.type(value, { delay: 30 });

    await expect(locator).toHaveValue(value);
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Assertions                                */
  /* -------------------------------------------------------------------------- */

  public async expectLoaded(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  public async expectToast(text: string | RegExp) {
    await expect(
      this.page
        .getByRole("alert")
        .filter({
          hasText: text,
        })
        .first(),
    ).toBeVisible();
  }
}
