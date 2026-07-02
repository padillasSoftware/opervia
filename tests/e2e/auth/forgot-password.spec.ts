import { test, expect } from '@playwright/test'

test('forgot password requires email', async ({ page }) => {
  await page.goto('/forgot-password')

  await page.getByRole('button', {
    name: /enviar|recuperar|restablecer/i
  }).click()

  await expect(
    page.getByText(/correo|email|requerido|obligatorio/i)
  ).toBeVisible()
})