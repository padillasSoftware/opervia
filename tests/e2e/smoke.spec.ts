import { test, expect } from '@playwright/test'

test('home page loads', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveURL(/\/$/)
})

test('login page loads', async ({ page }) => {
  await page.goto('/signing')

  await expect(page).toHaveURL(/signing/)
})