import { expect, test } from '@playwright/test'

import { expectMainVisible } from '../../../../../../../../../../tests/_e2eBrowserHelpers.ts'


const transactionId = 'a'.repeat(64)
const spentTransactionId = 'b'.repeat(64)
const transactionPath = `/network/bitcoin/tx/${transactionId}`
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
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-bitcoin-utxo-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
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
