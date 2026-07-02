import type { Page } from "@playwright/test";

export async function login(
  page: Page,
  email: string,
  password: string
) {
  await page.getByRole("textbox", { name: "Correo electrónico" }).fill(email);

  await page.getByLabel("Contraseña").fill(password);

  await page.getByRole("button", { name: "Iniciar sesión" }).click();
}