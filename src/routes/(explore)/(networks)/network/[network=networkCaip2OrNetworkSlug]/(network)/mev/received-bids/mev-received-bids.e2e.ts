import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../../../../../tests/_e2eBrowserHelpers.ts'
import bindings from '$/sources/MevRelay/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'


const bidTrace = {
	slot: '14917871',
	parent_hash: '0x053111d81bc7dbd54b1519b7d91723627e1681506f76240a133c5805c8ddd620',
	block_hash: '0xae76bc643d558c4dc3b2a4dd0036d2c407f538ed65583131400a1e643c96258e',
	builder_pubkey: '0x88510a78794b69e07f73b2f3ee309f78fc372dcb2ed85d5f80bbe7ebc579778f2a7d6aafbb8b00c00cb7241e1c800d65',
	proposer_pubkey: '0xace2aefa76021d068bb90b461f516d81480a557dacef9196cea762a1b9d6df03c75f895f2dc68bd12ca13060065a59aa',
	proposer_fee_recipient: '0xba1951dF0C0A52af23857c5ab48B4C43A57E7ed1',
	gas_limit: '59999943',
	gas_used: '37301926',
	value: '5316647666874603',
	num_tx: '483',
	block_number: '25680883',
	timestamp: '1786068803',
	timestamp_ms: '1786068803855',
	optimistic_submission: true,
} as const


test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-mev-received-bids-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
})


test('MEV received-bid list connects relay intake to builder and execution block', async ({ page }) => {
	const relayRequests: string[] = []
	for (const binding of bindings[Source.MevRelay_Rest])
		await page.route(
			(url) => decodeURIComponent(url.pathname).startsWith(
				`/api-proxy/${sourceBindingId(binding)}/0/`
			),
			async (route) => {
				const providerUrl = new URL(decodeURIComponent(
					new URL(route.request().url()).pathname.split('/').at(-1) ?? ''
				))
				relayRequests.push(providerUrl.pathname + providerUrl.search)
				if (
					!providerUrl.pathname.endsWith('/proposer_payload_delivered')
					&& !providerUrl.pathname.endsWith('/builder_blocks_received')
				)
					throw new Error(`Unexpected MEV relay request ${providerUrl.pathname}`)
				await route.fulfill({
					json: [bidTrace],
				})
			}
		)

	await page.goto('/network/eip155:1/mev/received-bids', { waitUntil: 'load' })
	await expectMainVisible(page)
	const main = page.locator('#main')
	await expect(main).toContainText('Slot 14917871', { timeout: 120_000 })
	await expect(main).toContainText('5316647666874603 wei')
	await main.getByRole('link', { name: /Slot 14917871/ }).first().click()
	await expect(page).toHaveURL(/\/mev\/payload\/received-bid\//)
	await expect(main).toContainText('Received at')
	await expect(main.locator('[data-error], [role="alert"]')).toHaveCount(0)
	await expect.poll(() => relayRequests.filter((request) => request.includes('builder_blocks_received')).length).toBe(2)
})
