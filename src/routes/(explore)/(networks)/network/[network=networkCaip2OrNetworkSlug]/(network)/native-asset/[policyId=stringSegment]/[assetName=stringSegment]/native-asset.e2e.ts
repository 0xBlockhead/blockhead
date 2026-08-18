import { expect, test } from '@playwright/test'
import type { Page, TestInfo } from '@playwright/test'

import {
	assertMainSettled,
	expectMainVisible,
	installChainlistRpcsJsonStub,
	setupPageRuntimeDiagnostics,
} from '../../../../../../../../../../tests/_e2eBrowserHelpers.ts'
import blockFixture from '$/sources/Blockfrost/Rest/fixtures/block.json' with { type: 'json' }
import type {
	BlockfrostAsset,
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
import type { CardanoscanBlock, CardanoscanToken } from '$/sources/Cardanoscan/Rest/envelopes.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'


const attach = { timeout: 120_000 }
const policyId = 'a'.repeat(56)
const assetName = '746f6b656e'
const assetUnit = `${policyId}${assetName}`
const fingerprint = 'asset1example'
const assetPath = `/network/cardano/native-asset/${policyId}/${assetName}`
const blockfrostBaseUrl = 'https://cardano-mainnet.blockfrost.io/api/v0/'
const koiosBaseUrl = 'https://api.koios.rest/api/v1/'
const cardanoscanBaseUrl = 'https://api.cardanoscan.io'

const nativeAsset = {
	asset: assetUnit,
	policy_id: policyId,
	asset_name: assetName,
	fingerprint,
	quantity: '12',
	initial_mint_tx_hash: 'mint-hash',
	mint_or_burn_count: 3,
	onchain_metadata: {
		name: 'Token',
	},
	metadata: null,
} satisfies BlockfrostAsset

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

const cardanoscanAsset = {
	policyId,
	assetName,
	fingerprint,
	assetId: assetUnit,
	totalSupply: '12',
	txCount: 3,
	mintedOn: cardanoscanBlock.timestamp,
} satisfies CardanoscanToken

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

const installCardanoNativeAssetFixtures = async (page: Page) => {
	const requests = new Map<string, number>()
	const unexpected: string[] = []
	const blockfrostResponseByRequest = new Map<string, JsonValue>(Object.entries({
		[`GET assets/${assetUnit}`]: nativeAsset,
		'GET assets?count=16': [] satisfies BlockfrostAssets,
		'GET blocks/latest': latestBlock,
		'GET blocks/latest/txs?count=16': [] satisfies BlockfrostTransactions,
	}))
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
				if (
					request.method() === 'GET'
					&& requestKey.includes('/api/v1/asset')
					&& requestKey.includes(assetUnit)
				) {
					await route.fulfill({
						contentType: 'application/json',
						json: cardanoscanAsset,
					})
					return
				}
			}

			const response = (
				baseUrl === blockfrostBaseUrl ?
					blockfrostResponseByRequest.get(requestKey)
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
		databaseName: `cardano-native-asset-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
	return installCardanoNativeAssetFixtures(page)
}


test('renders a Blockfrost-backed Cardano native asset fingerprint', async ({ page }, testInfo) => {
	testInfo.setTimeout(180_000)
	const fixture = await preparePage(page, testInfo)
	const diagnostics = setupPageRuntimeDiagnostics(page, {
		failFast: true,
		failOnDevServerContamination: true,
		failOnTanStackWarnings: true,
	})

	await diagnostics.step(page.goto(assetPath, {
		waitUntil: 'domcontentloaded',
	}))
	await expectMainVisible(page, 120_000, diagnostics)
	await diagnostics.step(assertMainSettled(page, 120_000, diagnostics))

	await expect(page.locator('#main').getByText(fingerprint, {
		exact: true,
	}).first()).toBeAttached(attach)
	await expect(page.locator('#main [data-error]')).toHaveCount(0)

	expect(diagnostics.issues).toEqual([])
	expect(fixture.unexpected).toEqual([])
	expect(fixture.requests.get(`GET assets/${assetUnit}`)).toBeGreaterThan(0)
	expect(fixture.requests.get('GET blocks/latest')).toBeGreaterThan(0)
})
