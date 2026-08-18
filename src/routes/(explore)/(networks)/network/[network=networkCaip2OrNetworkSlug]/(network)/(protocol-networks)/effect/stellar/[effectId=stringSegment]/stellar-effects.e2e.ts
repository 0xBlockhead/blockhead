import { expect, test } from '@playwright/test'


const effectId = '0000000429496733697-0000000001'
const accountId = `G${'A'.repeat(55)}`
const effectPath = `/network/stellar/effect/stellar/${effectId}`
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
const effect = {
	id: effectId,
	paging_token: '429496733697-1',
	account: accountId,
	type: 'account_created',
	type_i: 0,
	created_at: '2026-07-22T00:00:00Z',
	starting_balance: '20.0000000',
}


test('Stellar effect detail route renders the Horizon ledger side-effect', async ({ page }) => {
	test.setTimeout(180_000)
	await page.route('**/api-proxy/**', async (route) => {
		const requestUrl = (() => {
			try {
				return decodeURIComponent(route.request().url())
			} catch {
				return route.request().url()
			}
		})()
		if (requestUrl.includes('/operations/') && requestUrl.includes('/effects')) {
			await route.fulfill({
				json: {
					_links: {
						next: {
							href: 'https://horizon.stellar.org/next',
						},
					},
					_embedded: {
						records: [
							effect,
						],
					},
				},
			})
			return
		}
		if (requestUrl.includes('horizon.stellar.org')) {
			await route.fulfill({ json: emptyHorizonPage })
			return
		}

		await route.fulfill({ json: {} })
	})

	await page.goto(effectPath, {
		waitUntil: 'domcontentloaded',
	})
	await expect(page.locator('#main').getByText('account_created').first()).toBeAttached({
		timeout: 120_000,
	})
})
