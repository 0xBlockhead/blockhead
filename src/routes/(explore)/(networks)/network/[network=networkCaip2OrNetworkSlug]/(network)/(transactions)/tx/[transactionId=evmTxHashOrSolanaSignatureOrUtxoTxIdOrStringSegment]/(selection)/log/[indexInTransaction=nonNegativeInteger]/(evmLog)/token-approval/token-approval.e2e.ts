import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../../../../../../../../../../../tests/_e2eBrowserHelpers.ts'
import { installRouteViewSqliteIsolation } from '../../../../../../../../../../../../../../../tests/e2e/_routeViewFixtures.ts'


const transactionHash = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const approvalPath = `/network/eip155:1/tx/${transactionHash}/log/0/token-approval`
const owner = '0x1111111111111111111111111111111111111111'
const spender = '0x2222222222222222222222222222222222222222'
const tokenContract = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const voltaireOrigins = new Set([
	'https://ethereum.publicnode.com',
	'https://eth.drpc.org',
	'https://eth.llamarpc.com',
	'https://mainnet.rpc.buidlguidl.com',
])
const approvalTopics = [
	'0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
	`0x${'00'.repeat(12)}${owner.slice(2)}`,
	`0x${'00'.repeat(12)}${spender.slice(2)}`,
]
const approvalData = `0x${'0'.repeat(63)}a`


test.setTimeout(180_000)

test.beforeEach(async ({ page }, testInfo) => {
	await installRouteViewSqliteIsolation(page, `blockhead-token-approval-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`)
	await installChainlistRpcsJsonStub(page)
})


test('token approval route renders the same Blockscout and Voltaire receipt-log occurrence', async ({ page }) => {
	await page.route('**/api-proxy/**', async (route) => {
		const providerUrl = new URL(decodeURIComponent(
			new URL(route.request().url()).pathname.split('/').at(-1) ?? ''
		))
		if (providerUrl.origin === 'https://eth.blockscout.com') {
			const blockscoutResult = (
				providerUrl.pathname.endsWith(`/transactions/${transactionHash}/logs`) ?
					{
						items: [{
							address: {
								ens_domain_name: null,
								hash: tokenContract,
								implementations: [],
								is_contract: true,
								is_scam: false,
								is_verified: null,
								metadata: null,
								name: null,
								proxy_type: null,
								reputation: 'ok',
							},
							block_hash: '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
							block_number: 16,
							block_timestamp: null,
							decoded: null,
							index: 0,
							smart_contract: null,
							transaction_hash: transactionHash,
							topics: [
								...approvalTopics,
								null,
							],
							data: approvalData,
						}],
						next_page_params: null,
					}
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
		await route.fulfill({
			json: {
				jsonrpc: '2.0',
				id: request.id,
				result: (
					request.method === 'eth_getTransactionReceipt' ?
						{
							transactionHash,
							transactionIndex: '0x0',
							blockHash: '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
							blockNumber: '0x10',
							from: owner,
							status: '0x1',
							gasUsed: '0x5208',
							cumulativeGasUsed: '0x5208',
							effectiveGasPrice: '0x3b9aca00',
							logsBloom: `0x${'00'.repeat(256)}`,
							logs: [{
								address: tokenContract,
								blockHash: '0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
								blockNumber: '0x10',
								data: approvalData,
								logIndex: '0x0',
								removed: false,
								transactionHash,
								transactionIndex: '0x0',
								topics: approvalTopics,
							}],
						}
					:
						null
				),
			},
		})
	})

	await page.goto(approvalPath, { waitUntil: 'load' })
	await expectMainVisible(page)
	const main = page.locator('#main')
	await expect(main.getByText('Allowance').first()).toBeVisible({ timeout: 120_000 })
	await expect(main.getByText('ERC-20').first()).toBeAttached()
	await expect(main.getByText('Token contract').first()).toBeAttached()
	await expect(main.getByText('Owner').first()).toBeAttached()
	await expect(main.getByText('Approved actor').first()).toBeAttached()
	await expect(main.getByText('10').first()).toBeAttached()
})
