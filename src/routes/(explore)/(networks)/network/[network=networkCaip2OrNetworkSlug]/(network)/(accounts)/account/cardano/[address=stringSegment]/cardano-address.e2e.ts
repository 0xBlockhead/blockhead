import { expect, test } from '@playwright/test'
import type { Page, TestInfo } from '@playwright/test'

import {
	assertMainSettled,
	expectMainVisible,
	installChainlistRpcsJsonStub,
	setupPageRuntimeDiagnostics,
} from '../../../../../../../../../../../tests/_e2eBrowserHelpers.ts'
import blockFixture from '$/sources/Blockfrost/Rest/fixtures/block.json' with { type: 'json' }
import type {
	BlockfrostAddress,
	BlockfrostAddressTotal,
	BlockfrostAddressTransactions,
	BlockfrostAddressUtxos,
	BlockfrostAssets,
	BlockfrostBlock,
	BlockfrostTransactions,
} from '$/sources/Blockfrost/Rest/types.ts'
import type {
	CardanoKoiosAsset,
	CardanoKoiosBlock,
	CardanoKoiosBlockTransaction,
	CardanoKoiosTip,
} from '$/sources/CardanoKoios/Rest/types.ts'
import type { CardanoscanBlock } from '$/sources/Cardanoscan/Rest/envelopes.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'


const attach = { timeout: 120_000 }
const address = 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3n0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgse35a3x'
const addressPath = `/network/cardano/account/cardano/${address}`
const blockfrostBaseUrl = 'https://cardano-mainnet.blockfrost.io/api/v0/'
const koiosBaseUrl = 'https://api.koios.rest/api/v1/'
const cardanoscanBaseUrl = 'https://api.cardanoscan.io'

const cardanoAddress = {
	address,
	amount: [
		{
			unit: 'lovelace',
			quantity: '42000000',
		},
	],
	stake_address: null,
	type: 'shelley',
	script: false,
} satisfies BlockfrostAddress

const addressTotal = {
	address,
	received_sum: [],
	sent_sum: [],
	tx_count: 12,
} satisfies BlockfrostAddressTotal

const latestBlock = blockFixture satisfies BlockfrostBlock

const koiosTip = {
	hash: 'koios-block-hash',
	epoch_no: 599,
	era: 'Conway',
	abs_slot: 130_000_000,
	block_height: 10_000_000,
	block_time: 1_720_000_000,
} satisfies CardanoKoiosTip

const cardanoscanBlock = {
	hash: 'a'.repeat(64),
	previousBlockHash: 'b'.repeat(64),
	blockHeight: 12_345_678,
	totalFees: '1000',
	slot: 432_000,
	epoch: 500,
	absSlot: 130_000_000,
	timestamp: '2026-07-31T19:32:02.172Z',
	txCount: 7,
	assetTxCount: 1,
	totalOutput: '5000000',
	slotLeader: 'pool1example',
	bodySize: 80_000,
} satisfies CardanoscanBlock

const decodeProxyUrl = (url: string) => {
	try {
		const once = decodeURIComponent(url)
		try {
			return decodeURIComponent(once)
		} catch {
			return once
		}
	} catch {
		return url
	}
}

const installCardanoAddressFixtures = async (page: Page) => {
	const requests = new Map<string, number>()
	const unexpected: string[] = []
	const blockfrostResponseByRequest = new Map<string, JsonValue>(Object.entries({
		[`GET addresses/${address}`]: cardanoAddress,
		[`GET addresses/${address}/total`]: addressTotal,
		'GET assets?count=16': [] satisfies BlockfrostAssets,
		'GET blocks/latest': latestBlock,
		'GET blocks/latest/txs?count=16': [] satisfies BlockfrostTransactions,
	}))
	const blockfrostListResponseByPrefix = [
		{
			prefix: `GET addresses/${address}/transactions`,
			response: [] satisfies BlockfrostAddressTransactions,
		},
		{
			prefix: `GET addresses/${address}/utxos`,
			response: [] satisfies BlockfrostAddressUtxos,
		},
	]
	const koiosResponseByRequest = new Map<string, JsonValue>(Object.entries({
		'GET asset_list?limit=16': [] satisfies CardanoKoiosAsset[],
		'GET blocks?limit=16': [] satisfies CardanoKoiosBlock[],
		'GET tip': [koiosTip],
		'POST block_txs': [] satisfies CardanoKoiosBlockTransaction[],
	}))

	await page.route(
		'**/api-proxy/**',
		async (route) => {
			const request = route.request()
			const decodedUrl = decodeProxyUrl(request.url())
			const baseUrl = (
				decodedUrl.includes(blockfrostBaseUrl) ?
					blockfrostBaseUrl
				: decodedUrl.includes(koiosBaseUrl) ?
					koiosBaseUrl
				: decodedUrl.includes(cardanoscanBaseUrl) ?
					cardanoscanBaseUrl
				:
					undefined
			)
			if (baseUrl == null) {
				await route.fulfill({
					contentType: 'application/json',
					json: {},
				})
				return
			}

			const requestKey = `${request.method()} ${decodedUrl.slice(decodedUrl.indexOf(baseUrl) + baseUrl.length)}`
			requests.set(requestKey, (requests.get(requestKey) ?? 0) + 1)

			if (baseUrl === cardanoscanBaseUrl) {
				if (request.method() === 'GET' && requestKey.includes('/api/v1/block/latest')) {
					await route.fulfill({
						contentType: 'application/json',
						json: cardanoscanBlock,
					})
					return
				}
			}

			const response = (
				baseUrl === blockfrostBaseUrl ?
					(
						blockfrostResponseByRequest.get(requestKey)
						?? blockfrostListResponseByPrefix.find(({ prefix }) => requestKey.startsWith(prefix))?.response
					)
				: baseUrl === koiosBaseUrl ?
					koiosResponseByRequest.get(requestKey)
				:
					undefined
			)
			if (response === undefined) {
				unexpected.push(requestKey)
				await route.fulfill({
					body: `Unexpected Cardano fixture request: ${requestKey}`,
					status: 418,
				})
				return
			}

			await route.fulfill({
				contentType: 'application/json',
				json: response,
			})
		}
	)

	return {
		requests,
		unexpected,
	}
}

const preparePage = async (
	page: Page,
	testInfo: TestInfo
) => {
	await page.addInitScript(({ databaseName, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = databaseName
		window.__blockheadWaSqliteVfsNameOverride = databaseName.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		databaseName: `cardano-address-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
	return installCardanoAddressFixtures(page)
}


test('renders a Blockfrost-backed Cardano address kind', async ({ page }, testInfo) => {
	testInfo.setTimeout(180_000)
	const fixture = await preparePage(page, testInfo)
	const diagnostics = setupPageRuntimeDiagnostics(page, {
		failFast: true,
		failOnDevServerContamination: true,
		failOnTanStackWarnings: true,
	})

	await diagnostics.step(page.goto(addressPath, {
		waitUntil: 'domcontentloaded',
	}))
	await expectMainVisible(page, 120_000, diagnostics)
	await diagnostics.step(assertMainSettled(page, 120_000, diagnostics))

	await expect(page.locator('#main').getByText('shelley-key', {
		exact: true,
	}).first()).toBeAttached(attach)
	await expect(page.locator('#main [data-error]')).toHaveCount(0)

	expect(diagnostics.issues).toEqual([])
	expect(fixture.unexpected).toEqual([])
	expect(fixture.requests.get(`GET addresses/${address}`)).toBeGreaterThan(0)
	expect(fixture.requests.get('GET blocks/latest')).toBeGreaterThan(0)
})
