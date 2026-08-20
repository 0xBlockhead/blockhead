import { expect, test } from '@playwright/test'

import aptosFullnodeBindings from '$/sources/AptosFullnode/bindings.ts'
import aptosIndexerBindings from '$/sources/AptosIndexer/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'


const transactionVersion = '42'
const transactionPath = `/network/aptos:1/tx/version/${transactionVersion}`
const stateChangePath = `${transactionPath}/state-change/0`
const eventPath = `/network/aptos:1/transaction/${transactionVersion}/event/0`
const aptosProxyPath = `/api-proxy/${sourceBindingId(aptosFullnodeBindings[Source.AptosFullnode_Rest][0])}/0/`
const aptosIndexerProxyPath = `/api-proxy/${sourceBindingId(aptosIndexerBindings[Source.AptosIndexer_Graphql][0])}/0/`
const aptosResponseHeaders = {
	'x-aptos-chain-id': '1',
	'x-aptos-ledger-version': transactionVersion,
	'x-aptos-ledger-oldest-version': '1',
	'x-aptos-ledger-timestampusec': '1720000000123456',
	'x-aptos-epoch': '7',
	'x-aptos-block-height': '9',
	'x-aptos-oldest-block-height': '1',
}
const transaction = {
	type: 'user_transaction',
	version: transactionVersion,
	hash: '0x42',
	state_change_hash: '0xstatechange',
	event_root_hash: '0xeventroot',
	sender: '0xa11ce',
	sequence_number: '8',
	max_gas_amount: '1000',
	expiration_timestamp_secs: '1720001000',
	payload: {
		type: 'module_bundle_payload',
	},
	timestamp: '1720000000123456',
	gas_unit_price: '100',
	gas_used: '21',
	success: true,
	vm_status: 'Executed successfully',
	accumulator_root_hash: '0xacc',
	events: [{
		guid: {
			creation_number: '3',
			account_address: '0xa11ce',
		},
		sequence_number: '4',
		type: '0x1::coin::DepositEvent',
		data: {
			amount: '5',
		},
	}],
	changes: [{
		type: 'write_resource',
		state_key_hash: '0xstate',
		address: '0xa11ce',
		data: {
			type: '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>',
			data: {
				coin: {
					value: '5',
				},
			},
		},
	}],
}


test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-aptos-effects-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})


test('committed Aptos transaction links its state change and event detail pages', async ({ page }) => {
	test.setTimeout(180_000)
	const unexpectedProviderRequests: string[] = []
	let transactionRequestCount = 0
	let transactionIndexerRequestCount = 0

	await page.route('**/api-proxy/**', async (route) => {
		const request = route.request()
		const decodedUrl = decodeURIComponent(request.url())
		if (
			request.method() === 'POST'
			&& decodedUrl.includes(aptosIndexerProxyPath)
			&& decodedUrl.endsWith('/v1/graphql')
			&& request.postData()?.includes('user_transactions')
			&& request.postData()?.includes(`"version":"${transactionVersion}"`)
		) {
			transactionIndexerRequestCount += 1
			await route.fulfill({
				contentType: 'application/json',
				json: {
					data: {
						user_transactions: [{
							block_height: '9',
							gas_unit_price: '100',
							sender: transaction.sender,
							timestamp: '2024-07-03T09:46:40.123Z',
							version: transactionVersion,
						}],
					},
				},
			})
			return
		}
		if (
			request.method() === 'GET'
			&& decodedUrl.includes(aptosProxyPath)
			&& decodedUrl.endsWith(`/v1/transactions/by_version/${transactionVersion}`)
		) {
			transactionRequestCount += 1
			await route.fulfill({
				contentType: 'application/json',
				headers: aptosResponseHeaders,
				json: transaction,
			})
			return
		}
		if (
			request.method() === 'GET'
			&& decodedUrl.includes(aptosProxyPath)
			&& decodedUrl.endsWith(`/v1/blocks/by_version/${transactionVersion}?with_transactions=false`)
		) {
			await route.fulfill({
				contentType: 'application/json',
				headers: aptosResponseHeaders,
				json: {
					block_height: '9',
					block_hash: '0xblock',
					block_timestamp: '1720000000123456',
					first_version: '40',
					last_version: '44',
				},
			})
			return
		}

		unexpectedProviderRequests.push(`${request.method()} ${decodedUrl}`)
		await route.fulfill({
			body: 'Unexpected Aptos effects fixture request',
			status: 418,
		})
	})

	await page.goto(transactionPath, { waitUntil: 'domcontentloaded' })
	await expect(page.locator('#main')).toBeVisible()
	await expect(page.locator('#main').getByText('user_transaction', { exact: true }).first()).toBeAttached({
		timeout: 120_000,
	})

	await expect(page.getByRole('region', { name: 'State changes', exact: true })).toBeAttached()
	const stateChangeLink = page.locator(`#main a[href="${stateChangePath}"]`).filter({
		hasText: 'write_resource',
	}).first()
	await expect(stateChangeLink).toBeAttached()

	await expect(page.getByRole('region', { name: 'Events', exact: true })).toBeAttached()
	const eventLink = page.locator(`#main a[href="${eventPath}"]`).filter({
		hasText: '0x1::coin::DepositEvent',
	}).first()
	await expect(eventLink).toBeAttached()

	await stateChangeLink.click()
	await expect(page).toHaveURL(stateChangePath)
	await expect(page.getByRole('heading', { name: 'write_resource', exact: true }).first()).toBeAttached({
		timeout: 120_000,
	})
	await expect(page.getByText('0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>', { exact: true })).toBeAttached()

	await page.goto(transactionPath, { waitUntil: 'domcontentloaded' })
	await page.locator(`#main a[href="${eventPath}"]`).filter({
		hasText: '0x1::coin::DepositEvent',
	}).first().click()
	await expect(page).toHaveURL(eventPath)
	await expect(page.getByRole('heading', { name: '0x1::coin::DepositEvent', exact: true }).first()).toBeAttached({
		timeout: 120_000,
	})
	await expect(page.getByText('0xa11ce', { exact: true }).first()).toBeAttached()

	expect(transactionRequestCount).toBeGreaterThan(0)
	expect(transactionIndexerRequestCount).toBeGreaterThan(0)
	expect(unexpectedProviderRequests).toEqual([])
})
