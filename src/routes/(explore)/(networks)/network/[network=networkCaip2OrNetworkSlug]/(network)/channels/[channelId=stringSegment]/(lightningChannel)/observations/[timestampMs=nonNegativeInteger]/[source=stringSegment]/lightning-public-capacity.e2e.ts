import { expect, test } from '@playwright/test'


const channelId = '123456789'
const channelPath = `/network/lightning/channels/${channelId}`
const observationPath = `${channelPath}/observations/1735689600000/LightningMempoolSpace_Rest`


test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `bh-lightning-channel-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})

test('public channel materializes provider-clocked funding capacity and fee policy', async ({ page }) => {
	test.setTimeout(180_000)
	await page.route(`https://mempool.space/api/v1/lightning/channels/${channelId}`, async (route) => {
		await route.fulfill({
			json: {
				id: channelId,
				short_id: '456x789x0',
				status: 1,
				capacity: '250000',
				transaction_id: 'a'.repeat(64),
				transaction_vout: 0,
				created: '2024-01-01T00:00:00.000Z',
				updated_at: '2025-01-01T00:00:00.000Z',
				node_left: {
					public_key: `02${'b'.repeat(64)}`,
					fee_rate: 125,
				},
				node_right: {
					public_key: `03${'c'.repeat(64)}`,
					fee_rate: 125,
				},
			},
		})
	})

	await page.goto(channelPath, { waitUntil: 'domcontentloaded' })
	const observationLink = page.locator(`a[href='${observationPath}']`)
	await expect(observationLink).toBeAttached({ timeout: 120_000 })
	await observationLink.click()

	await expect(page.locator('#main')).toContainText('Channel funding capacity sats', {
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toContainText('250,000')
	await expect(page.locator('#main')).toContainText('Fee rate ppm')
	await expect(page.locator('#main')).toContainText('125')
	await expect(page.locator('#main')).not.toContainText('Local directional balance sats')
})
