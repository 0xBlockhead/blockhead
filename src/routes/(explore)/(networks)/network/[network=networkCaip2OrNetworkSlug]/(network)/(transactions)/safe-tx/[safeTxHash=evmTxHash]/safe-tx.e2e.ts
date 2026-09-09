import { expect, test } from '@playwright/test'

import { expectMainVisible } from '../../../../../../../../../../tests/_e2eBrowserHelpers.ts'
import { installRouteViewSqliteIsolation } from '../../../../../../../../../../tests/e2e/_routeViewFixtures.ts'


const safeAddress = `0x${'a'.repeat(40)}`
const ownerAddress = `0x${'b'.repeat(40)}`
const recipientAddress = `0x${'c'.repeat(40)}`
const masterCopy = `0x${'1'.repeat(40)}`
const moduleAddress = `0x${'2'.repeat(40)}`
const zeroAddress = `0x${'0'.repeat(40)}`
const safeTxHash = `0x${'d'.repeat(64)}`
const executionHash = `0x${'e'.repeat(64)}`
const safeTxPath = `/network/eip155:1/safe-tx/${safeTxHash}`
const executionTxPath = `/network/eip155:1/tx/${safeTxHash}`

const queuedSafeMultisigTransaction = {
	safe: safeAddress,
	to: recipientAddress,
	value: '1000',
	data: '0xa9059cbb',
	operation: 0,
	safeTxGas: '0',
	baseGas: '0',
	gasPrice: '0',
	gasToken: zeroAddress,
	refundReceiver: zeroAddress,
	nonce: '2',
	executionDate: null,
	submissionDate: '2026-07-22T00:00:00Z',
	modified: '2026-07-22T00:00:00Z',
	blockNumber: null,
	transactionHash: null,
	safeTxHash,
	proposer: ownerAddress,
	executor: null,
	isExecuted: false,
	isSuccessful: null,
	confirmationsRequired: 1,
	confirmations: [],
	trusted: true,
	signatures: null,
	origin: 'https://app.safe.global',
	ethGasPrice: null,
	proposedByDelegate: null,
}

const safeStatus = {
	address: safeAddress,
	nonce: '2',
	threshold: 1,
	owners: [
		ownerAddress,
	],
	masterCopy,
	modules: [
		moduleAddress,
	],
	fallbackHandler: recipientAddress,
	guard: zeroAddress,
	version: '1.4.1',
}


test.setTimeout(180_000)

test.beforeEach(async ({ page }, testInfo) => {
	await installRouteViewSqliteIsolation(page, testInfo, 'safe-tx')
})


test('native safe-tx route settles a SafeMultisigTransaction, not an EvmTransaction', async ({ page }) => {
	let safeMultisigTransactionReads = 0
	await page.route('**/api-proxy/**', async (route) => {
		const encodedTarget = new URL(route.request().url()).pathname.split('/').at(-1)
		if (encodedTarget == null) {
			await route.fallback()
			return
		}

		const providerUrl = new URL(decodeURIComponent(encodedTarget))
		if (providerUrl.origin !== 'https://api.safe.global') {
			await route.fallback()
			return
		}

		if (providerUrl.pathname.includes(`/api/v2/multisig-transactions/${safeTxHash}`)) {
			safeMultisigTransactionReads += 1
			await route.fulfill({
				json: queuedSafeMultisigTransaction,
			})
			return
		}

		if (providerUrl.pathname.includes(`/api/v1/safes/${safeAddress}`)) {
			await route.fulfill({
				json: safeStatus,
			})
			return
		}

		await route.fulfill({
			status: 404,
			json: {
				detail: 'Not found',
			},
		})
	})

	await page.goto(safeTxPath, { waitUntil: 'load' })
	await expectMainVisible(page)
	await expect(page).toHaveURL(safeTxPath)

	const main = page.locator('#main')
	await expect(page.getByRole('heading', { name: safeTxHash })).toBeAttached({ timeout: 120_000 })
	await expect(page).toHaveTitle(new RegExp(`${safeTxHash}.*Safe transaction`))
	await expect(main.getByRole('button', { name: 'Safe transaction' })).toBeAttached()
	await expect(page.getByText('A Safe-signed inner transaction identified by its EIP-712 safeTxHash')).toBeAttached()

	await expect(main.locator('dt', { hasText: /^Operation$/ })).toBeAttached({ timeout: 120_000 })
	await expect(main.locator('dd', { hasText: /^Call$/ })).toBeAttached()
	await expect(main.locator('dt', { hasText: /^Nonce$/ })).toBeAttached()
	await expect(main.locator('dd', { hasText: /^2$/ })).toBeAttached()
	await expect(main.locator('dt', { hasText: /^Confirmations required$/ })).toBeAttached()
	await expect(main.locator('dd', { hasText: /^1$/ })).toBeAttached()
	await expect(main.locator('dt', { hasText: /^Value$/ })).toBeAttached()
	await expect(main.locator('dd').filter({ hasText: /1[,.]?000|1000/ })).toBeAttached()
	await expect(main.locator('dt', { hasText: /^Data$/ })).toBeAttached()
	await expect(main.locator('dd', { hasText: '0xa9059cbb' })).toBeAttached()
	await expect(main.locator(`a[href="/account/${recipientAddress}"]`)).toBeAttached()

	await expect(main.locator('dt', { hasText: /^Execution transaction$/ })).toHaveCount(0)
	await expect(main.locator(`a[href="${executionTxPath}"]`)).toHaveCount(0)
	await expect(main.locator(`a[href="/network/eip155:1/tx/${executionHash}"]`)).toHaveCount(0)
	await expect(main.locator('[data-text="annotation"]', { hasText: /^EVM transaction$/ })).toHaveCount(0)
	expect(safeMultisigTransactionReads).toBeGreaterThan(0)
})
