import type { APIRequestContext } from "@playwright/test";
import type { FirstLoginUser } from "../factories/user.factory";

export class UserApi {
  constructor(private readonly request: APIRequestContext) {}

  async createUser(user: FirstLoginUser) {
    const response = await this.request.post("/api/e2e/users/first-login", {
      data: user,
    });

    const text = await response.text();

    if (!response.ok()) {
      throw new Error(`Failed to create first-login user: ${response.status()} ${text}`);
    }

    return JSON.parse(text);
  }
}