import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../../../../../tests/_e2eBrowserHelpers.ts'
import bindings from '$/sources/MevRelay/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'
import { installRouteViewSqliteIsolation } from '../../../../../../../../../tests/e2e/_routeViewFixtures.ts'


const payloadPath = '/network/eip155:1/mev/payloads'
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
} as const


test.beforeEach(async ({ page }, testInfo) => {
	await installRouteViewSqliteIsolation(page, `blockhead-mev-payload-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`)
	await installChainlistRpcsJsonStub(page)
})


test('MEV payload list renders source-owned cards without detail reads', async ({ page }) => {
	const relayRequests: string[] = []
	for (const binding of bindings[Source.MevRelay_Rest])
		await page.route(
			new RegExp(`/api-proxy/${encodeURIComponent(sourceBindingId(binding))}/0/`),
			async (route) => {
				const providerUrl = new URL(decodeURIComponent(
					new URL(route.request().url()).pathname.split('/').at(-1) ?? ''
				))
				relayRequests.push(providerUrl.pathname + providerUrl.search)
				if (providerUrl.pathname !== '/relay/v1/data/bidtraces/proposer_payload_delivered')
					throw new Error(`Unexpected MEV relay request ${providerUrl.pathname}`)

				await route.fulfill({
					json: [bidTrace],
				})
			}
		)

	await page.goto(payloadPath, { waitUntil: 'load' })
	await expectMainVisible(page)
	const main = page.locator('#main')
	const payloadLink = main.locator(`a[href="/network/eip155:1/mev/payload/boost-relay.flashbots.net/14917871/${bidTrace.block_hash}"]`)
	await expect(payloadLink).toContainText('Slot 14917871', { timeout: 120_000 })
	await expect(main).toContainText('5316647666874603 wei')
	await expect(main.locator('[data-error], [role="alert"]')).toHaveCount(0)
	await expect.poll(() => relayRequests.slice().sort()).toEqual([
		'/relay/v1/data/bidtraces/proposer_payload_delivered?limit=64',
		'/relay/v1/data/bidtraces/proposer_payload_delivered?limit=64',
	])
})
