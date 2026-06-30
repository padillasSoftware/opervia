import { test, expect } from '@playwright/test'


test('login page loads', async ({ page }) => {
  await page.goto('/signing')

  await expect(page).toHaveURL(/signing/)
})