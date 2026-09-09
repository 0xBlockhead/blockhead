import { expect, test } from '@playwright/test'

import { installChainlistRpcsJsonStub } from '../../../../../../../../../../../../tests/_e2eBrowserHelpers.ts'
import { installRouteViewSqliteIsolation } from '../../../../../../../../../../../../tests/e2e/_routeViewFixtures.ts'


const beaconBlockRoot = `0x${'1'.repeat(64)}`
const routePath = `/network/eip155:1/beacon-block/${beaconBlockRoot}/data-column/7`

test.beforeEach(async ({ page }, testInfo) => {
	await installRouteViewSqliteIsolation(page, `blockhead-beacon-data-column-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`)
	await installChainlistRpcsJsonStub(page)
})

test('PeerDAS data column renders protocol material and source-owned custody state', async ({ page }) => {
	const column = `0x${'ab'.repeat(2_048)}`
	const proof = `0x${'cd'.repeat(48)}`
	const commitment = `0x${'ef'.repeat(48)}`
	await page.route('**/*', async (route) => {
		const url = new URL(decodeURIComponent(route.request().url()))
		if (url.pathname === `/eth/v1/beacon/headers/${beaconBlockRoot}`) {
			await route.fulfill({
				json: {
					data: {
						root: beaconBlockRoot,
						canonical: true,
						header: {
							message: {
								slot: '64',
								proposer_index: '12',
								parent_root: `0x${'2'.repeat(64)}`,
								state_root: `0x${'3'.repeat(64)}`,
								body_root: `0x${'4'.repeat(64)}`,
							},
							signature: `0x${'5'.repeat(192)}`,
						},
					},
				},
			})
			return
		}
		if (url.pathname === `/eth/v2/beacon/blocks/${beaconBlockRoot}`) {
			await route.fulfill({
				json: {
					version: 'fulu',
					execution_optimistic: false,
					finalized: true,
					data: {
						signature: `0x${'5'.repeat(192)}`,
						message: {
							slot: '64',
							proposer_index: '12',
							parent_root: `0x${'2'.repeat(64)}`,
							state_root: `0x${'3'.repeat(64)}`,
							body: {
								attestations: [],
								deposits: [],
								proposer_slashings: [],
								attester_slashings: [],
							},
						},
					},
				},
			})
			return
		}
		if (url.pathname !== `/eth/v1/debug/beacon/data_column_sidecars/${beaconBlockRoot}`) {
			await route.continue()
			return
		}

		await route.fulfill({
			json: {
				version: 'fulu',
				execution_optimistic: false,
				finalized: true,
				data: [{
					index: '7',
					column: [column],
					kzg_commitments: [commitment],
					kzg_proofs: [proof],
					kzg_commitments_inclusion_proof: [],
					signed_block_header: {
						message: {
							slot: '64',
						},
						signature: '0x',
					},
				}],
			},
		})
	})

	await page.goto(routePath, { waitUntil: 'load' })
	const main = page.locator('#main')
	await expect(main).toContainText('Data column', { timeout: 120_000 })
	await expect(main).toContainText('fulu')
	await expect(main).toContainText('KZG proofs')
	await expect(main).toContainText('KZG commitments')
	await main.locator('a[href*="/observation/"]').click()
	await expect(main).toContainText('Finalized')
	await expect(main).toContainText('Yes')
	await expect(main).toContainText('https://ethereum-beacon-api.publicnode.com')
	await expect(main).toContainText('Beacon_Rest')
	await expect(main.locator('[data-resource-state="failed"]')).toHaveCount(0)
})
