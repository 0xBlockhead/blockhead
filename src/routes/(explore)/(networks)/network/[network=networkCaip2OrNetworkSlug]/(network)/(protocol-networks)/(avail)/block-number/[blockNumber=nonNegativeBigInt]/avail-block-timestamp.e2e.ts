import { expect, test } from '@playwright/test'

import bindings from '$/sources/Avail/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'


const blockNumber = 3_355_961
const blockPath = `/network/avail/block-number/${blockNumber}`
const blockHash = '0x16545958f0edb021cda965d8211875f3190c864cccacc6570873be3b4f926728'
const parentBlockHash = '0xdeba05bdac4cf9bc073498ad9a6c4022cd9a8d8500d4fae97a176d69fe543bc7'
const timestampMs = 1_787_225_800_000
const availProxyPath = `/api-proxy/${sourceBindingId(bindings[Source.Avail][0])}/0/`
const blockHeader = {
	parentHash: parentBlockHash,
	number: '0x333539',
	stateRoot: '0x6afae592c5e268ab98281f09ab08cff01c3214b9b97a54a84c6a828b51fe4c3f',
	extrinsicsRoot: '0x03128875b6516216633a1530e4da2295d30b29d821e4076638bd6999883998bf',
	digest: {
		logs: [],
	},
}
const parentBlockHeader = {
	...blockHeader,
	parentHash: '0x575aa5c95745ae82b71e1fcb1dc3f0c107148a2c7fd8004e20ac0ee479408a4e',
	number: '0x333538',
}


test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-avail-block-timestamp-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})

test('renders the runtime timestamp for an exact Avail block', async ({ page }) => {
	test.setTimeout(180_000)
	const consoleErrors: string[] = []
	const pageErrors: string[] = []
	const unexpectedRequests: string[] = []
	const requestedMethods: string[] = []
	page.on('console', (message) => {
		if (message.type() === 'error')
			consoleErrors.push(message.text())
	})
	page.on('pageerror', (error) => pageErrors.push(error.message))
	await page.route('**/api-proxy/**', async (route) => {
		const request = route.request()
		const decodedUrl = decodeURIComponent(request.url())
		const body = request.postDataJSON()
		if (request.method() === 'POST' && decodedUrl.includes(availProxyPath)) {
			requestedMethods.push(body.method)
			const result = (
				body.method === 'chain_getBlockHash' ?
					(body.params[0] === blockNumber - 1 ? parentBlockHash : blockHash)
				: body.method === 'chain_getHeader' ?
					(body.params[0] === parentBlockHash ? parentBlockHeader : blockHeader)
				: body.method === 'chain_getBlock' ?
					{
						block: {
							header: body.params[0] === parentBlockHash ? parentBlockHeader : blockHeader,
							extrinsics: [],
						},
					}
				: body.method === 'state_getStorage' ?
					(body.params[1] === parentBlockHash ? '0x202ff51ea0010000' : '0x407df51ea0010000')
				:
					undefined
			)
			if (result !== undefined) {
				await route.fulfill({
					contentType: 'application/json',
					json: {
						jsonrpc: '2.0',
						id: body.id,
						result,
					},
				})
				return
			}
		}

		unexpectedRequests.push(`${request.method()} ${decodedUrl}`)
		await route.fulfill({
			status: 418,
			body: 'Unexpected Avail block timestamp fixture request',
		})
	})

	await page.goto(blockPath, { waitUntil: 'domcontentloaded' })
	await expect(page.locator('#main').getByText('Timestamp', { exact: true })).toBeAttached({
		timeout: 120_000,
	})
	await expect(page.locator(`#main time[datetime='${new Date(timestampMs).toISOString()}']`)).toBeAttached()
	await expect(page.locator('#main [data-error], #main [role="alert"]')).toHaveCount(0)
	expect(consoleErrors).toEqual([])
	expect(pageErrors).toEqual([])
	expect(requestedMethods).toContain('state_getStorage')
	expect(unexpectedRequests).toEqual([])
})
