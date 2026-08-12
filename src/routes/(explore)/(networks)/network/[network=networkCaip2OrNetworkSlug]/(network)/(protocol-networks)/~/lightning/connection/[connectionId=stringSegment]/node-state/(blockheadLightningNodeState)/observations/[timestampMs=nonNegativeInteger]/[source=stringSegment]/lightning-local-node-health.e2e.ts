import { expect, test } from '@playwright/test'


const localNodePath = '/network/lightning/~/lightning/connection/lnd-1/node-state/observations/1735689600000/LightningLnd_Rest'
const lndPubkey = `02${'a'.repeat(64)}`

test('local LND observation visibly keeps identity, sync, resources, and peer health behind the credential proxy', async ({ page }) => {
	test.setTimeout(180_000)
	await page.route('**/api-proxy/**', async (route) => {
		const upstreamUrl = decodeURIComponent(route.request().url().split('/').at(-1) ?? '')
		if (upstreamUrl.endsWith('/v1/getinfo')) {
			await route.fulfill({
				json: {
					identity_pubkey: lndPubkey,
					alias: 'local-lnd',
					version: '0.18.4-beta',
					num_active_channels: 2,
					num_inactive_channels: 1,
					num_pending_channels: 3,
					num_peers: 4,
					block_height: 840000,
					best_header_timestamp: '1735689600',
					synced_to_chain: true,
					synced_to_graph: true,
				},
			})
			return
		}

		if (upstreamUrl.endsWith('/v1/balance/blockchain')) {
			await route.fulfill({
				json: {
					total_balance: '210000',
				},
			})
			return
		}

		if (upstreamUrl.endsWith('/v1/balance/channels')) {
			await route.fulfill({
				json: {
					balance: '120000',
					pending_open_balance: '30000',
				},
			})
			return
		}

		await route.abort()
	})

	await page.goto(localNodePath, { waitUntil: 'domcontentloaded' })

	await expect(page.locator('#main')).toContainText('lnd public key', {
		timeout: 120_000,
	})
	await expect(page.locator('#main')).toContainText(lndPubkey)
	await expect(page.locator('#main')).toContainText('local-lnd')
	await expect(page.locator('#main')).toContainText('synced to chain')
	await expect(page.locator('#main')).toContainText('synced to graph')
	await expect(page.locator('#main')).toContainText('block height')
	await expect(page.locator('#main')).toContainText('840,000')
	await expect(page.locator('#main')).toContainText('Local LND wallet balance sats')
	await expect(page.locator('#main')).toContainText('210,000')
	await expect(page.locator('#main')).toContainText('peer count')
	await expect(page.locator('#main')).toContainText('4')
})
