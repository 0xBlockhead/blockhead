import { expect, test } from '@playwright/test'

test('has expected h1', async ({ page }) => {
	await page.goto('/demo/playwright', { waitUntil: 'load', timeout: 120_000 })
	await expect(page.locator('#main')).toBeAttached({ timeout: 120_000 })
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Playwright e2e test demo')
})
