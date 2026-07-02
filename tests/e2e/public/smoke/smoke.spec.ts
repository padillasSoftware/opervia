import { test, expect } from '@playwright/test'

test('login page loads', async ({ page }) => {
  await page.goto('/signin')

  await expect(page).toHaveURL(/signin/)
  await expect(page.getByRole('button', { name: /iniciar/i })).toBeVisible()
})

test('forgot password page loads', async ({ page }) => {
  await page.goto('/forgot-password')

  await expect(page).toHaveURL(/forgot-password/)
})