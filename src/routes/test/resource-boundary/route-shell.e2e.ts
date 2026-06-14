import { expect, test } from '@playwright/test'

test('resource boundary test route renders inside the app shell', async ({ page }) => {
	await page.goto('/test/resource-boundary', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Resource boundary test route')
})
