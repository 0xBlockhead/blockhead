import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../../../../../../tests/_e2eBrowserHelpers.ts'


const transactionHash = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const transactionPath = `/network/eip155:1/tx/${transactionHash}`
const authorizationPath = `${transactionPath}/authorization/0`
const authority = '0x6666666666666666666666666666666666666666'
const delegation = '0x5555555555555555555555555555555555555555'
const voltaireOrigins = new Set([
	'https://ethereum.publicnode.com',
	'https://eth.drpc.org',
	'https://eth.llamarpc.com',
	'https://mainnet.rpc.buidlguidl.com',
])


test.setTimeout(180_000)

test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-eip7702-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
})


test('SetCode transaction authorizations retain native detail authority on a cold route', async ({ page }, testInfo) => {
	let blockscoutTransactionReads = 0
	await page.route('**/api-proxy/**', async (route) => {
		const providerUrl = new URL(decodeURIComponent(
			new URL(route.request().url()).pathname.split('/').at(-1) ?? ''
		))
		if (providerUrl.origin === 'https://eth.blockscout.com') {
			if (providerUrl.pathname.endsWith(`/transactions/${transactionHash}`)) {
				blockscoutTransactionReads += 1
				await route.fulfill({
					json: {
						from: {
							hash: '0x1111111111111111111111111111111111111111',
						},
						to: {
							hash: '0x2222222222222222222222222222222222222222',
						},
						gas_limit: '21000',
						gas_price: '1',
						gas_used: '21000',
						hash: transactionHash,
						nonce: 4,
						raw_input: '0x',
						value: '0',
						type: 4,
						status: 'ok',
						block_number: 12,
						position: 3,
						max_fee_per_gas: '2',
						max_priority_fee_per_gas: '1',
						authorization_list: [{
							address_hash: delegation,
							authority,
							chain_id: 1,
							nonce: '7',
							r: '1',
							s: '2',
							v: 1,
							status: 'ok',
						}],
					},
				})
				return
			}
			await route.fulfill({
				json: (
					providerUrl.pathname.endsWith('/raw-trace') ?
						[]
					:
						{ items: [] }
				),
			})
			return
		}
		if (!voltaireOrigins.has(providerUrl.origin)) {
			await route.fallback()
			return
		}

		const request = JSON.parse(route.request().postData() ?? '{}')
		const result = (
			request.method === 'eth_getTransactionByHash' ?
				{
					hash: transactionHash,
					blockHash: '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
					blockNumber: '0x10',
					from: '0x1111111111111111111111111111111111111111',
					to: '0x2222222222222222222222222222222222222222',
					type: '0x4',
					transactionIndex: '0x0',
					value: '0x0',
					nonce: '0x4',
					input: '0x',
					r: '0x01',
					s: '0x02',
					gas: '0x5208',
					gasPrice: '0x1',
					maxFeePerGas: '0x2',
					maxPriorityFeePerGas: '0x1',
				}
			: request.method === 'eth_getTransactionReceipt' ?
				{
					transactionHash,
					transactionIndex: '0x0',
					blockHash: '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
					blockNumber: '0x10',
					from: '0x1111111111111111111111111111111111111111',
					status: '0x1',
					gasUsed: '0x5208',
					cumulativeGasUsed: '0x5208',
					effectiveGasPrice: '0x1',
					logsBloom: `0x${'00'.repeat(256)}`,
					logs: [],
				}
			: request.method === 'debug_traceTransaction' ?
				null
			:
				null
		)
		await route.fulfill({
			json: {
				jsonrpc: '2.0',
				id: request.id,
				result,
			},
		})
	})

	await page.goto(transactionPath, { waitUntil: 'load' })
	await expectMainVisible(page)
	const main = page.locator('#main')
	await expect(main.getByRole('link', { name: 'Authorizations' })).toBeVisible({ timeout: 120_000 })
	await main.getByRole('link', { name: 'Authorizations' }).click()
	await expect(main.locator(`a[href="${authorizationPath}"]`)).toContainText(delegation)
	await main.locator(`a[href="${authorizationPath}"]`).click()
	await expect(page).toHaveURL(authorizationPath)
	await expect(main).toContainText(authority)

	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-eip7702-cold-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await page.goto(authorizationPath, { waitUntil: 'load' })
	await expectMainVisible(page)
	await expect(main).toContainText('Chain ID')
	await expect(main).toContainText('1')
	await expect(main).toContainText('nonce')
	await expect(main).toContainText('7')
	await expect(main).toContainText('verification status')
	await expect(main).toContainText('ok')
	await expect(main.getByRole('link', { name: delegation })).toBeAttached()
	expect(blockscoutTransactionReads).toBeGreaterThanOrEqual(2)
})
