import type { APIRequestContext } from "@playwright/test";

export class AuthApi {
  constructor(private readonly request: APIRequestContext) {}

  async createResetPasswordUrl(email: string) {
    let lastError: unknown;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await this.request.post(
          "/api/e2e/auth/reset-password-url",
          {
            data: { email },
            timeout: 15_000,
          },
        );

        const text = await response.text();

        if (response.ok()) {
          return JSON.parse(text) as { url: string };
        }

        lastError = new Error(
          `Failed to create reset password url: ${response.status()} ${text}`,
        );
      } catch (error) {
        lastError = error;
      }

      await new Promise((resolve) => setTimeout(resolve, attempt * 2_000));
    }

    throw lastError;
  }
}