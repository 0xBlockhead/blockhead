import { expect, test } from '@playwright/test'

test('has expected h1', async ({ page }) => {
	await page.goto('/demo/playwright', { waitUntil: 'load' })
	await expect(page.locator('h1')).toBeVisible()
})
