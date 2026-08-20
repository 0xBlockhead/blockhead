import { expect, test } from '@playwright/test'

import hederaMirrorNodeBindings from '$/sources/HederaMirrorNode/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'


const tokenId = '0.0.700'
const timestampMs = '1710000002000'
const tokenPath = `/network/hedera:mainnet/token/${tokenId}`
const observationPath = `${tokenPath}/observations/${timestampMs}/${Source.HederaMirrorNode_Rest}`
const hederaProxyPath = `/api-proxy/${sourceBindingId(hederaMirrorNodeBindings[Source.HederaMirrorNode_Rest][0])}/0/`
const token = {
	admin_key: {
		_type: 'ED25519',
		key: 'admin-key',
	},
	auto_renew_account: '0.0.98',
	auto_renew_period: 7_776_000,
	created_timestamp: '1710000000.000000001',
	custom_fees: {
		created_timestamp: '1710000002.000000003',
		fixed_fees: [{
			all_collectors_are_exempt: true,
			amount: '9007199254740993',
			collector_account_id: '0.0.98',
			denominating_token_id: '0.0.701',
		}],
		fractional_fees: [{
			amount: {
				denominator: '29',
				numerator: '12',
			},
			collector_account_id: '0.0.99',
			denominating_token_id: '0.0.700',
			maximum: '120',
			minimum: '30',
			net_of_transfers: true,
		}],
		royalty_fees: [{
			all_collectors_are_exempt: false,
			amount: {
				denominator: '100',
				numerator: '5',
			},
			collector_account_id: '0.0.100',
			fallback_fee: {
				amount: '1',
				denominating_token_id: '0.0.701',
			},
		}],
	},
	decimals: 0,
	deleted: false,
	expiry_timestamp: null,
	fee_schedule_key: null,
	freeze_key: null,
	kyc_key: null,
	max_supply: '1000',
	modified_timestamp: '1710000002.000000003',
	name: 'Custom Fee NFT',
	pause_key: null,
	pause_status: 'UNPAUSED',
	supply_key: null,
	supply_type: 'FINITE',
	symbol: 'FEE',
	token_id: tokenId,
	total_supply: '3',
	treasury_account_id: '0.0.98',
	type: 'NON_FUNGIBLE_UNIQUE',
	wipe_key: null,
}


test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-hedera-custom-fees-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})


test('Hedera token observation exposes fixed, fractional, and royalty fee details', async ({ page }) => {
	test.setTimeout(180_000)
	const unexpectedProviderRequests: string[] = []
	let tokenRequestCount = 0

	await page.route('**/api-proxy/**', async (route) => {
		const request = route.request()
		const decodedUrl = decodeURIComponent(request.url())
		if (
			request.method() === 'GET'
			&& decodedUrl.includes(hederaProxyPath)
			&& decodedUrl.endsWith(`/api/v1/tokens/${tokenId}`)
		) {
			tokenRequestCount += 1
			await route.fulfill({
				contentType: 'application/json',
				json: token,
			})
			return
		}
		if (
			request.method() === 'GET'
			&& decodedUrl.includes(hederaProxyPath)
			&& decodedUrl.endsWith('/api/v1/tokens/0.0.701')
		) {
			await route.fulfill({
				contentType: 'application/json',
				json: {
					...token,
					custom_fees: null,
					name: 'Fallback denomination',
					symbol: 'DENOM',
					token_id: '0.0.701',
					type: 'FUNGIBLE_COMMON',
				},
			})
			return
		}

		unexpectedProviderRequests.push(`${request.method()} ${decodedUrl}`)
		await route.fulfill({
			body: 'Unexpected Hedera custom-fee fixture request',
			status: 418,
		})
	})

	await page.goto(observationPath, { waitUntil: 'domcontentloaded' })
	await expect(page.locator('#main')).toBeVisible()
	await expect(page.getByRole('heading', { name: /^Custom fees \(/ }).first()).toBeAttached({
		timeout: 120_000,
	})

	for (const feeIndex of [0, 1, 2])
		await expect(page.locator(`#main a[href="${observationPath}/fee/${String(feeIndex)}"]`).first()).toBeAttached()

	await page.goto(`${observationPath}/fee/0`, { waitUntil: 'domcontentloaded' })
	await expect(page.getByText('fixed', { exact: true }).first()).toBeAttached({ timeout: 120_000 })
	await expect(page.getByText('9007199254740993', { exact: true }).first()).toBeAttached()
	await expect(page.getByText('0.0.98', { exact: true }).first()).toBeAttached()

	await page.goto(`${observationPath}/fee/1`, { waitUntil: 'domcontentloaded' })
	await expect(page.getByText('fractional', { exact: true }).first()).toBeAttached({ timeout: 120_000 })
	await expect(page.getByText('12', { exact: true }).first()).toBeAttached()
	await expect(page.getByText('29', { exact: true }).first()).toBeAttached()
	await expect(page.getByText('30', { exact: true }).first()).toBeAttached()
	await expect(page.getByText('120', { exact: true }).first()).toBeAttached()
	await expect(page.getByText('Yes', { exact: true }).first()).toBeAttached()

	await page.goto(`${observationPath}/fee/2`, { waitUntil: 'domcontentloaded' })
	await expect(page.getByText('royalty', { exact: true }).first()).toBeAttached({ timeout: 120_000 })
	await expect(page.getByText('5', { exact: true }).first()).toBeAttached()
	await expect(page.getByText('100', { exact: true }).first()).toBeAttached()
	await expect(page.getByText('1', { exact: true }).first()).toBeAttached()
	await expect(page.getByText('0.0.701', { exact: true }).first()).toBeAttached()

	expect(tokenRequestCount).toBeGreaterThan(0)
	expect(unexpectedProviderRequests).toEqual([])
})
