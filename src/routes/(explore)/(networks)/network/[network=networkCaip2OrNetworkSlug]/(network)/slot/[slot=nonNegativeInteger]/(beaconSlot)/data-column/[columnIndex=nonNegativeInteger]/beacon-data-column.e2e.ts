import { expect, test } from '@playwright/test'

import { installChainlistRpcsJsonStub } from '../../../../../../../../../../../../tests/_e2eBrowserHelpers.ts'


const routePath = '/network/eip155:1/slot/64/data-column/7'

test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-beacon-data-column-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
})

test('PeerDAS data column renders protocol material and source-owned custody state', async ({ page }) => {
	const column = `0x${'ab'.repeat(2_048)}`
	const proof = `0x${'cd'.repeat(48)}`
	const commitment = `0x${'ef'.repeat(48)}`
	await page.route('**/*', async (route) => {
		const url = decodeURIComponent(route.request().url())
		if (!url.includes('/eth/v1/debug/beacon/data_column_sidecars/64?indices=7')) {
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
