import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../../tests/_e2eBrowserHelpers.ts'
import { installRouteViewSqliteIsolation } from '../../../../../../tests/e2e/_routeViewFixtures.ts'


const tezosHead = {
	chain: 'mainnet',
	chainId: 'NetXdQprcVkpaWU',
	cycle: 800,
	level: 5_000_000,
	hash: 'BLhead',
	protocol: 'PsPROTOCOL',
	timestamp: '2026-07-16T12:34:56Z',
	synced: true,
}
const tezosCurrentHead = {
	...tezosHead,
	level: 5_000_001,
	hash: 'BLnext',
	timestamp: '2026-07-16T12:35:04Z',
}


test.setTimeout(180_000)

test.beforeEach(async ({ page }, testInfo) => {
	await installRouteViewSqliteIsolation(page, testInfo, 'provider-visible-proofs')
	await installChainlistRpcsJsonStub(page)
})

test('a listed Chainlist network with no RPC entries remains visibly available', async ({ page }) => {
	await page.route('**/api-proxy/**', async (route) => {
		const requestUrl = decodeURIComponent(route.request().url())
		if (!requestUrl.includes('chainlist.org/rpcs.json')) {
			await route.fallback()
			return
		}
		await route.fulfill({
			json: [{
				chainId: 127,
				name: 'Factory 127 Mainnet',
				nativeCurrency: {
					name: 'Factory 127',
					symbol: 'F127',
					decimals: 18,
				},
			}],
		})
	})

	await page.goto('/network/eip155:127', { waitUntil: 'load' })
	await expectMainVisible(page)
	await expect(page.locator('#main')).toContainText('Factory 127 Mainnet', { timeout: 120_000 })
	await expect(page.locator('#main')).toContainText('RPC endpoints are not listed for this network.')
	await expect(page.locator('#main [data-error]')).toHaveCount(0)
})

test('TzKT moving head retries visibly project one current network observation', async ({ page }) => {
	const tzktRequests: string[] = []
	const responses = [
		tezosHead,
		{
			level: tezosCurrentHead.level,
			timestamp: tezosCurrentHead.timestamp,
			totalSupply: 1_000_000_001,
		},
		tezosCurrentHead,
		tezosCurrentHead,
		{
			level: tezosCurrentHead.level,
			timestamp: tezosCurrentHead.timestamp,
			totalSupply: 1_000_000_001,
		},
		tezosCurrentHead,
	]
	await page.route('**/api-proxy/**', async (route) => {
		const requestUrl = decodeURIComponent(route.request().url())
		if (!requestUrl.includes('api.tzkt.io/v1/')) {
			await route.fallback()
			return
		}
		const providerUrl = new URL(
			new URL(route.request().url()).pathname.split('/').at(-1) ?? ''
		)
		if (
			providerUrl.pathname === '/v1/head'
			|| providerUrl.pathname === '/v1/statistics/current'
		) {
			tzktRequests.push(providerUrl.pathname)
			await route.fulfill({ json: responses.shift() ?? [] })
			return
		}
		await route.fulfill({ json: [] })
	})

	await page.goto('/network/tezos', { waitUntil: 'load' })
	await expectMainVisible(page)
	const main = page.locator('#main')
	await expect(main).toContainText('5000001', { timeout: 120_000 })
	expect(tzktRequests.slice(0, 6)).toEqual([
		'/v1/head',
		'/v1/statistics/current',
		'/v1/head',
		'/v1/head',
		'/v1/statistics/current',
		'/v1/head',
	])
	await expect(main).not.toContainText('statistics level does not match head')
	await expect(main.locator('[data-error]')).toHaveCount(0)
})
