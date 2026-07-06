import type { APIRequestContext } from "@playwright/test";

export class AuthApi {
  constructor(private readonly request: APIRequestContext) {}

  async createResetPasswordUrl(email: string) {
    
    const response = await this.request.post(
      "/api/e2e/auth/reset-password-url",
      {
        data: { email },
      },
    );

    const text = await response.text();

    if (!response.ok()) {
      throw new Error(
        `Failed to create reset password url: ${response.status()} ${text}`,
      );
    }

    return JSON.parse(text) as {
      url: string;
    };
  }
}