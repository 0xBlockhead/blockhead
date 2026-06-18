import { expect, test } from '@playwright/test'

test.describe('/proposals', () => {
	test('page loads and proposal query settles', async ({ page }, testInfo) => {
		testInfo.setTimeout(180_000)
		await page.goto('/proposals', { waitUntil: 'domcontentloaded' })

		await expect(page.locator('#nav-menu a[href="/proposals"]')).toBeVisible()

		const proposals = page.locator('#proposal-realms')
		await expect(proposals).toBeVisible()
		await expect(
			proposals.locator('details, section, p, a').first()
		).toBeAttached({ timeout: 120_000 })
	})
})
