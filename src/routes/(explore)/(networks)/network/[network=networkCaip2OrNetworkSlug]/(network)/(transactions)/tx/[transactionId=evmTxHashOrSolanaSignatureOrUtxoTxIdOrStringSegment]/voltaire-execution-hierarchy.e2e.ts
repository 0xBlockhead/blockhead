import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../../../../../../tests/_e2eBrowserHelpers.ts'
import { installRouteViewSqliteIsolation } from '../../../../../../../../../../tests/e2e/_routeViewFixtures.ts'


const transactionHash = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const transactionPath = `/network/eip155:1/tx/${transactionHash}`
const from = '0x1111111111111111111111111111111111111111'
const to = '0x2222222222222222222222222222222222222222'
const voltaireOrigins = new Set([
	'https://ethereum.publicnode.com',
	'https://eth.drpc.org',
	'https://eth.llamarpc.com',
	'https://mainnet.rpc.buidlguidl.com',
])


test.setTimeout(180_000)

test.beforeEach(async ({ page }, testInfo) => {
	await installRouteViewSqliteIsolation(page, `blockhead-voltaire-execution-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`)
	await installChainlistRpcsJsonStub(page)
})


test('transaction hierarchy renders indexed state changes, receipt logs and nested traces', async ({ page }) => {
	const voltaireMethods: string[] = []
	await page.route('**/api-proxy/**', async (route) => {
		const providerUrl = new URL(decodeURIComponent(
			new URL(route.request().url()).pathname.split('/').at(-1) ?? ''
		))
		if (providerUrl.origin === 'https://eth.blockscout.com') {
			const blockscoutResult = (
				providerUrl.pathname.endsWith(`/transactions/${transactionHash}`) ?
					{
						from: { hash: from },
						gas_limit: '21000',
						hash: transactionHash,
						nonce: 2,
						raw_input: '0x1234',
						to: { hash: to },
						value: '1',
					}
				: providerUrl.pathname.endsWith('/state-changes') ?
					{
						items: [{
							address: { hash: from },
							balance_after: '7',
							balance_before: '5',
							change: '2',
							is_miner: false,
							token: null,
							type: 'coin',
						}],
						next_page_params: null,
					}
				: providerUrl.pathname.endsWith('/raw-trace') ?
					[]
				:
					{ items: [] }
			)
			await route.fulfill({
				json: blockscoutResult,
			})
			return
		}
		if (!voltaireOrigins.has(providerUrl.origin)) {
			await route.fallback()
			return
		}

		const request = JSON.parse(route.request().postData() ?? '{}')
		voltaireMethods.push(request.method)
		const result = (
			request.method === 'eth_getTransactionByHash' ?
				{
					hash: transactionHash,
					blockHash: '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
					blockNumber: '0x10',
					from,
					to,
					type: '0x2',
					transactionIndex: '0x0',
					value: '0x1',
					nonce: '0x2',
					input: '0x1234',
					r: '0x01',
					s: '0x02',
					gas: '0x5208',
					gasPrice: '0x3b9aca00',
					maxFeePerGas: '0x77359400',
					maxPriorityFeePerGas: '0x3b9aca00',
				}
			: request.method === 'eth_getTransactionReceipt' ?
				{
					transactionHash,
					transactionIndex: '0x0',
					blockHash: '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
					blockNumber: '0x10',
					from,
					status: '0x1',
					gasUsed: '0x5208',
					cumulativeGasUsed: '0x5208',
					effectiveGasPrice: '0x3b9aca00',
					logsBloom: `0x${'00'.repeat(256)}`,
					logs: [{
						address: to,
						blockHash: '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
						blockNumber: '0x10',
						data: `0x${'0'.repeat(63)}a`,
						logIndex: '0x0',
						removed: false,
						transactionHash,
						transactionIndex: '0x0',
						topics: [
							'0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
							`0x${'00'.repeat(12)}${from.slice(2)}`,
							`0x${'00'.repeat(12)}${to.slice(2)}`,
						],
					}],
				}
			: request.method === 'debug_traceTransaction' ?
				{
					type: 'CALL',
					from,
					to,
					value: '0x1',
					gas: '0x5208',
					gasUsed: '0x5000',
					input: '0x1234',
					output: '0x',
					calls: [{
						type: 'DELEGATECALL',
						from: to,
						to: from,
						gas: '0x4000',
						gasUsed: '0x3000',
						input: '0xabcd',
						output: '0x',
					}],
				}
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
	await expect(main.getByRole('link', { name: 'State changes' })).toBeVisible({ timeout: 120_000 })
	await main.getByRole('link', { name: 'State changes' }).click()
	await expect(main).toContainText('State changes (1)', { timeout: 120_000 })
	await expect(main).toContainText('Coin', { timeout: 120_000 })
	await expect(main.getByRole('link', { name: 'Token approvals' })).toBeVisible({ timeout: 120_000 })
	await main.getByRole('link', { name: 'Token approvals' }).click()
	await expect(main).toContainText('Allowance', { timeout: 120_000 })
	await expect(main).toContainText('ERC-20', { timeout: 120_000 })
	await expect(main.getByRole('link', { name: 'Logs' })).toBeVisible({ timeout: 120_000 })
	await main.getByRole('link', { name: 'Logs' }).click()
	await expect(main).toContainText('Log #0')
	await main.getByRole('link', { name: 'Traces' }).click()
	await expect(main).toContainText('Trace #0')
	await expect(main).toContainText('Call')
	expect(voltaireMethods).toContain('eth_getTransactionReceipt')
	expect(voltaireMethods).toContain('debug_traceTransaction')
})
