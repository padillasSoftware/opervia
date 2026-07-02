import type { Page } from '@playwright/test'

export async function login(page: Page, email: string, password: string) {
  await page.goto('/signin')

  await page.getByLabel(/correo|email/i).fill(email)
  await page.getByLabel(/contraseña|password/i).fill(password)

  await page.getByRole('button', {
    name: /iniciar sesión|ingresar|login/i
  }).click()
}