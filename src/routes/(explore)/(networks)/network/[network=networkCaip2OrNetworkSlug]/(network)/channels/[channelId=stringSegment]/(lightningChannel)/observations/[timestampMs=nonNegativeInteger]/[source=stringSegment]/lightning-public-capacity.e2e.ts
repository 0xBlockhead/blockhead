import { expect, test } from '@playwright/test'


const channelId = '123456789'
const observedAtMs = '1735689600000'
const channelPath = `/network/lightning/channels/${channelId}/observations/${observedAtMs}/LightningMempoolSpace_Rest`

test('public graph funding capacity remains visibly distinct from local LND balances', async ({ page }) => {
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
				fee_rate: 125,
				node_right: {
					public_key: `02${'b'.repeat(64)}`,
				},
			},
		})
	})

	await page.goto(channelPath, { waitUntil: 'domcontentloaded' })

	await expect(page.locator('#main')).toContainText('Channel funding capacity sats', {
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toContainText('250,000')
	await expect(page.locator('#main')).not.toContainText('Local directional balance sats')
})
