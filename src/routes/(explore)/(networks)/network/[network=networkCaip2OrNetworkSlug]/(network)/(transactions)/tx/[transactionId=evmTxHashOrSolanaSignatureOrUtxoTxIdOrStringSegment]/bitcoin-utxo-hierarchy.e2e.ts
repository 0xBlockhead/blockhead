import { expect, test } from '@playwright/test'

import { expectMainVisible } from '../../../../../../../../../../tests/_e2eBrowserHelpers.ts'
import { installRouteViewSqliteIsolation } from '../../../../../../../../../../tests/e2e/_routeViewFixtures.ts'


const transactionId = 'a'.repeat(64)
const spentTransactionId = 'b'.repeat(64)
const transactionPath = `/network/bitcoin/tx/${transactionId}`
const testnetTransactionPath = `/network/bitcoin-testnet/tx/${transactionId}`
const transactionWire = {
	txid: transactionId,
	version: 2,
	locktime: 840_000,
	size: 220,
	weight: 640,
	fee: 1_200,
	status: {
		confirmed: false,
	},
	vin: [{
		txid: spentTransactionId,
		vout: 1,
		is_coinbase: false,
		scriptsig: '',
		scriptsig_asm: '30440220deadbeef',
		witness: [
			'3045022100cafe',
			'02bead',
		],
		sequence: 0xfffffffd,
	}],
	vout: [{
		scriptpubkey: '0014deadbeef',
		scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 deadbeef',
		scriptpubkey_type: 'v0_p2wpkh',
		scriptpubkey_address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
		value: 98_800,
	}],
}


test.setTimeout(180_000)

test.beforeEach(async ({ page }, testInfo) => {
	await installRouteViewSqliteIsolation(page, `blockhead-bitcoin-utxo-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`)
})


test('Bitcoin transaction renders materialized native input and output facts', async ({ page }) => {
	await page.route(`**/api/tx/${transactionId}`, async (route) => {
		await route.fulfill({
			json: transactionWire,
		})
	})

	await page.goto(transactionPath, { waitUntil: 'load' })
	await expectMainVisible(page)
	const main = page.locator('#main')
	await expect(main).toContainText('UTXO transaction', { timeout: 120_000 })
	await main.getByRole('link', { name: /Input #0/ }).click()
	await expect(main).toContainText('30440220deadbeef')
	await expect(main).toContainText('3045022100cafe')
	await expect(main).toContainText('Output #1')

	await page.locator(`a[href='${transactionPath}']`).first().click()

	await main.getByRole('link', { name: 'Outputs' }).click()
	await main.getByRole('link', { name: /Output #0/ }).click()
	await expect(main).toContainText('98,800')
	await expect(main).toContainText('v0_p2wpkh')
})

test('Bitcoin Testnet transaction renders through the native Esplora hierarchy', async ({ page }) => {
	await page.route(`**/testnet/api/tx/${transactionId}`, async (route) => {
		await route.fulfill({
			json: transactionWire,
		})
	})

	await page.goto(testnetTransactionPath, { waitUntil: 'load' })
	await expectMainVisible(page)
	const main = page.locator('#main')
	await expect(main).toContainText('Bitcoin Testnet', { timeout: 120_000 })
	await expect(main).toContainText('UTXO transaction')
	await expect(main.getByRole('link', { name: /Input #0/ })).toBeAttached()
	await expect(main.getByRole('link', { name: /Output #0/ })).toBeAttached({ timeout: 120_000 })
	await main.getByRole('link', { name: /Input #0/ }).click()
	await expect(main).toContainText('30440220deadbeef')
	await expect(main.locator('[data-resource-state="failed"]')).toHaveCount(0)
})

test('Bitcoin Testnet transaction executes the mempool.space source beside Esplora', async ({ page }) => {
	const providerRequests: string[] = []
	page.on('request', (request) => {
		if (['fetch', 'xhr'].includes(request.resourceType()))
			providerRequests.push(request.url())
	})
	await page.route('**/*', async (route) => {
		const url = route.request().url()
		if (
			url.includes('/testnet/api/')
			&& new URL(url).pathname.endsWith(`/tx/${transactionId}`)
		)
			await route.fulfill({
				json: transactionWire,
			})
		else if (
			url.includes('/testnet/api/')
			&& new URL(url).pathname.endsWith(`/tx/${transactionId}/outspend/0`)
		)
			await route.fulfill({
				json: {
					spent: false,
				},
			})
		else
			await route.continue()
	})

	await page.goto(testnetTransactionPath, { waitUntil: 'load' })
	await expectMainVisible(page)
	const main = page.locator('#main')
	await expect(main).toContainText('Bitcoin Testnet', { timeout: 120_000 })
	await expect(main).toContainText('UTXO transaction', { timeout: 120_000 })
	await expect.poll(
		() => providerRequests.some((url) => url.includes(`mempool.space/testnet/api/tx/${transactionId}`)),
		{
			message: 'Bitcoin Testnet transaction did not execute the mempool.space testnet transport',
			timeout: 120_000,
		}
	).toBe(true)
	await expect(main.getByRole('link', { name: /Input #0/ })).toBeAttached({ timeout: 120_000 })
	await expect(main.getByRole('link', { name: /Output #0/ })).toBeAttached({ timeout: 120_000 })
})
