import { test, expect } from '@playwright/test'

test('first login page loads', async ({ page }) => {
  await page.goto('/first-login')

  await expect(page).toHaveURL(/first-login/)
})