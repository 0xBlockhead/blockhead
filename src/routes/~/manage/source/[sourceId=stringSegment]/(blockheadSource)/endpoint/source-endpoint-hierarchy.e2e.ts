import { expect, test } from '@playwright/test'


test('shows each executable endpoint as its own source-owned capability and health journey', async ({ page }, testInfo) => {
	testInfo.setTimeout(180_000)
	await page.addInitScript(({ databaseName, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = databaseName
		window.__blockheadWaSqliteVfsNameOverride = databaseName.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		databaseName: `source-endpoint-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})

	await page.goto('/~/manage/source/MempoolSpace_Rest', {
		waitUntil: 'domcontentloaded',
	})
	const endpointLink = page.locator('a[href*="/endpoint/"][href$="/0"]').first()
	await expect(endpointLink).toBeAttached({ timeout: 120_000 })
	await expect(endpointLink).toHaveAttribute('href', /\/endpoint\/.*\/0$/)
	await endpointLink.click()

	await expect(page.locator('#main')).toContainText('https://mempool.space/api', { timeout: 120_000 })
	await expect(page.locator('#main')).toContainText('RestJson')
	await expect(page.locator('#main')).toContainText('Caip2Network')
	await expect(page.locator('#main')).toContainText('bip122:000000000019d6689c085ae165831e93')
	await expect(page.locator('#main').getByText(/Latest health|No endpoint observations yet\.|Available|Internal Error/).first()).toBeAttached({ timeout: 120_000 })
})
