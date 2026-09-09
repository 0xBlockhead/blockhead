import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../../../../tests/_e2eBrowserHelpers.ts'
import { installRouteViewSqliteIsolation } from '../../../../../../../../tests/e2e/_routeViewFixtures.ts'


const withdrawalPath = '/network/eip155:1/withdrawals'
const beaconRestOrigin = 'https://ethereum-beacon-api.publicnode.com'

test.setTimeout(180_000)

test.beforeEach(async ({ page }, testInfo) => {
	await installRouteViewSqliteIsolation(page, `blockhead-beacon-duty-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`)
	await installChainlistRpcsJsonStub(page)
})

test('Beacon operation lists render source-owned head-duty cards without child fetches', async ({ page }) => {
	const beaconRequests: string[] = []
	await page.route(`${beaconRestOrigin}/**`, async (route) => {
		const url = new URL(route.request().url())
		beaconRequests.push(url.pathname)
		if (
			url.pathname === '/eth/v1/beacon/headers/head'
			|| url.pathname === '/eth/v1/beacon/headers/123'
		) {
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
		if (url.pathname === `/eth/v2/beacon/blocks/0x${'11'.repeat(32)}`) {
			await route.fulfill({
				json: {
					version: 'electra',
					execution_optimistic: false,
					finalized: true,
					data: {
						signature: `0x${'55'.repeat(96)}`,
						message: {
							slot: '123',
							proposer_index: '12',
							parent_root: `0x${'22'.repeat(32)}`,
							state_root: `0x${'33'.repeat(32)}`,
							body: {
								deposits: [],
								attestations: [{
									aggregation_bits: '0x03',
									data: {
										index: '4',
									},
								}],
								proposer_slashings: [{}],
								attester_slashings: [{}],
								execution_payload: {
									block_hash: `0x${'66'.repeat(32)}`,
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

	await page.goto(withdrawalPath, { waitUntil: 'load' })
	await expectMainVisible(page)
	await expect(page.locator('#main')).toContainText('Withdrawal #7', { timeout: 120_000 })

	await page.goto('/network/eip155:1/attestations', { waitUntil: 'load' })
	await expect(page.locator('#main')).toContainText('Attestation #0', { timeout: 120_000 })

	await page.goto('/network/eip155:1/slashings', { waitUntil: 'load' })
	await expect(page.locator('#main').getByText('Slashing #0', { exact: true })).toHaveCount(2, { timeout: 120_000 })

	await expect(page.locator('#main [data-error], #main [role="alert"]')).toHaveCount(0)
	await expect.poll(() => beaconRequests).toEqual([
		'/eth/v1/beacon/headers/head',
		'/eth/v1/beacon/headers/123',
		`/eth/v2/beacon/blocks/0x${'11'.repeat(32)}`,
		'/eth/v1/beacon/headers/head',
		'/eth/v1/beacon/headers/123',
		`/eth/v2/beacon/blocks/0x${'11'.repeat(32)}`,
		'/eth/v1/beacon/headers/head',
		'/eth/v1/beacon/headers/123',
		`/eth/v2/beacon/blocks/0x${'11'.repeat(32)}`,
	])
})
