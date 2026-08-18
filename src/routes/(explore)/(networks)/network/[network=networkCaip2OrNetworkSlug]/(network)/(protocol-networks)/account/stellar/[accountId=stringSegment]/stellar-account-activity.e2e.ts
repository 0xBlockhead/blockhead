import { expect, test } from '@playwright/test'

import { assertMainSettled } from '../../../../../../../../../../../tests/_e2eBrowserHelpers.ts'


const accountId = `G${'A'.repeat(55)}`
const otherAccountId = `G${'B'.repeat(55)}`
const accountPath = `/network/stellar/account/stellar/${accountId}`
const paymentHash = 'a'.repeat(64)
const operationHash = 'b'.repeat(64)
const emptyHorizonPage = {
	_links: {
		next: {
			href: '',
		},
	},
	_embedded: {
		records: [],
	},
}
const account = {
	id: accountId,
	account_id: accountId,
	sequence: '9223372036854775807',
	subentry_count: 2,
	last_modified_ledger: 100,
	last_modified_time: '2026-07-22T00:00:00Z',
	thresholds: {
		low_threshold: 0,
		med_threshold: 1,
		high_threshold: 2,
	},
	balances: [
		{
			asset_type: 'native',
			balance: '12345678901234567890.1234567',
			buying_liabilities: '0.0000000',
			selling_liabilities: '0.0000000',
		},
		{
			asset_type: 'credit_alphanum4',
			asset_code: 'USDC',
			asset_issuer: otherAccountId,
			balance: '12.3456789',
			limit: '922337203685.4775807',
		},
	],
	signers: [],
}


test('Stellar account Activity renders Horizon operations and payments as StellarOperation rows', async ({ page }) => {
	test.setTimeout(180_000)
	await page.route('**/api-proxy/**', async (route) => {
		const requestUrl = (() => {
			try {
				return decodeURIComponent(route.request().url())
			} catch {
				return route.request().url()
			}
		})()
		if (requestUrl.includes(`/accounts/${accountId}/operations`)) {
			await route.fulfill({
				json: {
					_links: {
						next: {
							href: 'https://horizon.stellar.org/next',
						},
					},
					_embedded: {
						records: [
							{
								id: '273998503801384962',
								paging_token: '102',
								transaction_hash: operationHash,
								type: 'manage_data',
								type_i: 10,
								created_at: '2026-07-22T00:00:00Z',
								source_account: accountId,
							},
						],
					},
				},
			})
			return
		}
		if (requestUrl.includes(`/accounts/${accountId}/payments`)) {
			await route.fulfill({
				json: {
					_links: {
						next: {
							href: 'https://horizon.stellar.org/next',
						},
					},
					_embedded: {
						records: [
							{
								id: '273998503801384961',
								paging_token: '101',
								transaction_hash: paymentHash,
								type: 'payment',
								type_i: 1,
								created_at: '2026-07-22T00:00:00Z',
								from: otherAccountId,
								to: accountId,
								amount: '1.0000000',
								asset_type: 'native',
							},
						],
					},
				},
			})
			return
		}
		if (
			requestUrl.includes(`/accounts/${accountId}`)
			&& !requestUrl.includes(`/accounts/${accountId}/`)
		) {
			await route.fulfill({
				json: account,
			})
			return
		}
		if (requestUrl.includes('horizon.stellar.org')) {
			await route.fulfill({ json: emptyHorizonPage })
			return
		}

		await route.fulfill({ json: {} })
	})

	await page.goto(accountPath, {
		waitUntil: 'domcontentloaded',
	})
	await expect(page.locator('#main')).toBeAttached({
		timeout: 120_000,
	})
	await assertMainSettled(page, 120_000)

	const activity = page.locator('#main .network-view-collapsible-activity')
	await activity.locator('a[data-scroll-marker-label="Operations"]').click()
	const operations = activity.locator('section[data-scroll-marker-label="Operations"]')
	await expect(
		operations.locator(`a[href*="/transaction/stellar/${operationHash}/operation/2"]`)
	).toBeAttached({
		timeout: 120_000,
	})

	await activity.locator('a[data-scroll-marker-label="Payments"]').click()
	const payments = activity.locator('section[data-scroll-marker-label="Payments"]')
	await expect(
		payments.locator(`a[href*="/transaction/stellar/${paymentHash}/operation/1"]`)
	).toBeAttached({
		timeout: 120_000,
	})
})
