import { expect, type Page } from "@playwright/test";

export async function login(page: Page, email: string, password: string) {
  await page.getByRole("textbox", { name: "Correo electrónico" }).fill(email);

  await page.getByLabel("Contraseña").fill(password);

  await page.getByRole("button", { name: "Iniciar sesión" }).click();
}

export async function loginAs(page: Page, email: string, password: string) {
  if (!email || !password) {
    throw new Error("Faltan credenciales QA");
  }

  const response = await page.request.post("/api/auth/signin", {
    data: {
      email,
      password,
    },
  });

  expect(response.status()).toBe(200);

  await page.goto("/dashboard");

  await expect(page).not.toHaveURL(/\/signin/);
}