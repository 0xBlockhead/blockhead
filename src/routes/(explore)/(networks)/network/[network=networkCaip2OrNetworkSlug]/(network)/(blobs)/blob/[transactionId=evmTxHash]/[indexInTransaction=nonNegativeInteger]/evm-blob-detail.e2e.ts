import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../../../../../../../tests/_e2eBrowserHelpers.ts'
import { installRouteViewSqliteIsolation } from '../../../../../../../../../../../tests/e2e/_routeViewFixtures.ts'


const transactionHash = `0x${'aa'.repeat(32)}`
const versionedHash = `0x01${'bb'.repeat(31)}`
const commitment = `0x${'cc'.repeat(48)}`
const voltaireOrigins = new Set([
	'https://ethereum.publicnode.com',
	'https://eth.drpc.org',
	'https://eth.llamarpc.com',
	'https://mainnet.rpc.buidlguidl.com',
])


test.setTimeout(180_000)

test.beforeEach(async ({ page }, testInfo) => {
	await installRouteViewSqliteIsolation(page, testInfo, 'evm-blob')
	await installChainlistRpcsJsonStub(page)
})


test('blob detail renders native transaction identity and Blobscan commitment', async ({ page }) => {
	await page.route('**/api-proxy/**', async (route) => {
		const providerUrl = new URL(decodeURIComponent(
			new URL(route.request().url()).pathname.split('/').at(-1) ?? ''
		))
		if (providerUrl.origin === 'https://api.blobscan.com') {
			await route.fulfill({
				json: (
					providerUrl.pathname.endsWith(`/transactions/${transactionHash}`) ?
						{
							hash: transactionHash,
							blockNumber: 16,
							blobs: [{ versionedHash }],
						}
					:
						{
							versionedHash,
							commitment,
							blockNumber: 16,
							txHash: transactionHash,
							index: 0,
						}
				),
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
				result: {
					hash: transactionHash,
					blockHash: `0x${'dd'.repeat(32)}`,
					blockNumber: '0x10',
					blobVersionedHashes: [versionedHash],
					from: `0x${'11'.repeat(20)}`,
					to: `0x${'22'.repeat(20)}`,
					type: '0x3',
					transactionIndex: '0x0',
					value: '0x0',
					nonce: '0x1',
					input: '0x',
					r: `0x${'01'.repeat(32)}`,
					s: `0x${'02'.repeat(32)}`,
					v: '0x1b',
					gas: '0x5208',
					gasPrice: '0x3b9aca00',
					maxFeePerGas: '0x77359400',
					maxPriorityFeePerGas: '0x3b9aca00',
					maxFeePerBlobGas: '0x77359400',
				},
			},
		})
	})

	await page.goto(`/network/eip155:1/blob/${transactionHash}/0`, { waitUntil: 'load' })
	await expectMainVisible(page)
	const main = page.locator('#main')
	await expect(main).toContainText('Blob #0', { timeout: 120_000 })
	await expect(main).toContainText(versionedHash)
	await expect(main).toContainText(commitment)
	await expect(main.locator('[data-error], [role="alert"]')).toHaveCount(0)
})
