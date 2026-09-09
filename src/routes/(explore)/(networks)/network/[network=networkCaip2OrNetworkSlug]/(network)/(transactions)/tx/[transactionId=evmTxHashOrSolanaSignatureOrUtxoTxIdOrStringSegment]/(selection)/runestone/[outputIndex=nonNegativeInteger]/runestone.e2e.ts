import { expect, test, type Route } from '@playwright/test'
import { installRouteViewSqliteIsolation } from '../../../../../../../../../../../../../tests/e2e/_routeViewFixtures.ts'


const txId = 'e'.repeat(64)
const runestonePath = `/network/bitcoin/tx/${txId}/runestone/0`
const helloWorldInscriptionHex = (
	'0063'
	+ '036f7264'
	+ '0101'
	+ '18746578742f706c61696e3b636861727365743d7574662d38'
	+ '00'
	+ '0d48656c6c6f2c20776f726c6421'
	+ '68'
)
const transactionWire = {
	txid: txId,
	version: 2,
	locktime: 0,
	size: 200,
	weight: 400,
	fee: 100,
	status: {
		confirmed: true,
		block_height: 840_000,
		block_hash: 'f'.repeat(64),
	},
	vin: [{
		txid: '1'.repeat(64),
		vout: 0,
		is_coinbase: false,
		sequence: 0xffffffff,
		witness: [
			helloWorldInscriptionHex,
		],
	}],
	vout: [{
		scriptpubkey: '6a5d03020100',
		scriptpubkey_type: 'op_return',
		value: 0,
	}, {
		scriptpubkey: '0014',
		scriptpubkey_type: 'v0_p2wpkh',
		scriptpubkey_address: 'bc1qexample',
		value: 546,
	}],
}


test.setTimeout(180_000)


test.beforeEach(async ({ page }, testInfo) => {
	await installRouteViewSqliteIsolation(page, testInfo, 'bitcoin-runestone')
})


const fulfillFromMempoolSpace = async (
	route: Route,
	pathname: string
) => {
	if (pathname === `/api/tx/${txId}`)
		await route.fulfill({ json: transactionWire })
	else if (pathname === `/api/tx/${txId}/outspend/0`)
		await route.fulfill({ json: { spent: false } })
	else
		throw new Error(`Unexpected mempool.space request ${pathname}`)
}


test('renders native Bitcoin runestone output details from protocol payloads', async ({ page }) => {
	await page.route('https://mempool.space/api/**', async (route) => {
		const pathname = new URL(route.request().url()).pathname
		await fulfillFromMempoolSpace(route, pathname)
	})

	await page.route('**/api-proxy/**', async (route) => {
		const providerUrl = new URL(decodeURIComponent(
			new URL(route.request().url()).pathname.split('/').at(-1) ?? ''
		))
		if (providerUrl.origin === 'https://mempool.space') {
			await fulfillFromMempoolSpace(route, providerUrl.pathname)
			return
		}
		throw new Error(`Unexpected proxy request ${route.request().url()}`)
	})

	await page.goto(runestonePath, { waitUntil: 'load' })
	const main = page.locator('#main')
	await expect(main).toBeVisible({ timeout: 120_000 })
	await expect(main.getByText('020100')).toBeAttached({ timeout: 120_000 })
	await expect(main.getByRole('definition').filter({ hasText: /^No$/ })).toBeAttached({ timeout: 120_000 })
})
