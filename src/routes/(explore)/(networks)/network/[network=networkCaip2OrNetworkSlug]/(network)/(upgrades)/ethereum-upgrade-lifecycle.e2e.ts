import { expect, test } from '@playwright/test'

test('Ethereum consensus upgrade route renders catalogued fork identity', async ({ page }) => {
	test.setTimeout(180_000)
	await page.goto('/network/eip155:1/upgrades/consensus/bellatrix', {
		waitUntil: 'domcontentloaded',
	})

	const main = page.locator('#main')
	await expect(main).toContainText('Bellatrix', {
		timeout: 120_000,
	})
	await expect(main).toContainText('Consensus fork')
	await expect(main.locator('[data-resource-state="failed"]')).toHaveCount(0)
})
