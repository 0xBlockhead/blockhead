import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../../../../tests/_e2eBrowserHelpers.ts'


const networkPath = '/network/eip155:1/withdrawals'
const beaconRestOrigin = 'https://ethereum-beacon-api.publicnode.com'

test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-beacon-duty-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
})

test('Beacon withdrawal list renders the source-owned head-duty card without a child fetch', async ({ page }) => {
	const beaconRequests: string[] = []
	await page.route(`${beaconRestOrigin}/**`, async (route) => {
		const url = new URL(route.request().url())
		beaconRequests.push(url.pathname)
		if (url.pathname === '/eth/v1/beacon/headers/head') {
			await route.fulfill({
				json: {
					data: {
						root: `0x${'11'.repeat(32)}`,
						canonical: true,
						header: {
							message: {
								slot: '123',
								proposer_index: '12',
								parent_root: `0x${'22'.repeat(32)}`,
								state_root: `0x${'33'.repeat(32)}`,
								body_root: `0x${'44'.repeat(32)}`,
							},
							signature: `0x${'55'.repeat(96)}`,
						},
					},
				},
			})
			return
		}
		if (url.pathname === '/eth/v2/beacon/blocks/123') {
			await route.fulfill({
				json: {
					data: {
						message: {
							body: {
								attestations: [{
									aggregation_bits: '0x03',
									data: {
										index: '4',
									},
								}],
								proposer_slashings: [],
								attester_slashings: [],
								execution_payload: {
									withdrawals: [{
										index: '7',
										validator_index: '12',
										address: `0x${'00'.repeat(19)}01`,
										amount: '32000000000',
									}],
								},
							},
						},
					},
				},
			})
			return
		}

		throw new Error(`Unexpected Beacon REST request ${url.pathname}`)
	})

	await page.goto(networkPath, { waitUntil: 'load' })
	await expectMainVisible(page)
	const main = page.locator('#main')
	await expect(main).toContainText('Withdrawal #7', { timeout: 120_000 })
	await expect(main.locator('[data-error], [role="alert"]')).toHaveCount(0)
	await expect.poll(() => beaconRequests).toEqual([
		'/eth/v1/beacon/headers/head',
		'/eth/v2/beacon/blocks/123',
	])
})
