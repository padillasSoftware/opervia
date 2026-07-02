import { test, expect } from '@playwright/test'
import { login } from '../helpers/auth.helper'

test('shows error with invalid credentials', async ({ page }) => {
  await login(page, 'wrong@email.com', 'wrong-password')

  await expect(
    page.getByText(/credenciales|incorrect|inválid|error/i)
  ).toBeVisible()
})