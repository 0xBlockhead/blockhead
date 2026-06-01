import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	clearOriginOpfs,
	collapseNetworkEntityView,
	installChainlistRpcsJsonStub,
	jsonStringifyForExpectMessage,
	preflightChainHeadAdvancesWithRetries,
	publicJsonRpcHttpUrlForChainE2e,
	readNetworkHeadBlockBigint,
	readNetworkHeadEpochBigint,
	readNetworkHeadSlotBigint,
	setupNetworkLiveFailFast,
} from '../_e2eBrowserHelpers.ts'

test.describe('Network summary dl (collapsed): Block / Epoch / Slot live', () => {
	test('(browser) /network/eip155:1 collapsed: head block, epoch, slot attach and block advances', async ({ page }) => {
		test.setTimeout(400_000)
		const { step } = setupNetworkLiveFailFast(page)
		await installChainlistRpcsJsonStub(page)

		const rpcUrlRaw = await publicJsonRpcHttpUrlForChainE2e(1)
		expect(
			rpcUrlRaw,
			'no HTTP JSON-RPC for chain 1 (ExecutionEndpoints / Chainlist)',
		).not.toBeNull()
		if (rpcUrlRaw == null) {
			throw new Error('no HTTP JSON-RPC for chain 1 (ExecutionEndpoints / Chainlist)')
		}
		const preflight = await preflightChainHeadAdvancesWithRetries(
			page,
			rpcUrlRaw,
			3_000,
			{ attempts: 8, betweenAttemptsMs: 4_000 },
		)
		expect(
			preflight.ok,
			preflight.ok
				? 'ok'
				:
					'detail' in preflight && preflight.detail != null
					? jsonStringifyForExpectMessage(preflight.detail)
					:
						jsonStringifyForExpectMessage(preflight),
		).toBe(true)

		await step(page.goto('/', { waitUntil: 'domcontentloaded' }))
		await step(clearOriginOpfs(page))
		await step(page.goto('/network/eip155:1', { waitUntil: 'load' }))
		await step(expect(page.locator('#main')).toBeVisible())
		await step(assertMainSettled(page, 120_000))

		await step(expect(page.locator('#network-summary-head-block')).toBeVisible({
			timeout: 45_000,
		}))
		await step(expect(page.locator('.network-view-carousel-groups')).toBeAttached({
			timeout: 120_000,
		}))

		await step(expect(page.locator('#network-summary-head-block a[href*="/block/"]')).toBeAttached({
			timeout: 120_000,
		}))

		const headBaseline = await readNetworkHeadBlockBigint(page, 60_000)
		expect(headBaseline, 'head block in summary when expanded').not.toBeNull()
		expect((headBaseline ?? 0n) > 0n).toBe(true)

		const epochBaseline = await readNetworkHeadEpochBigint(page, 60_000)
		expect(epochBaseline, 'head epoch in summary when expanded').not.toBeNull()

		const slotBaseline = await readNetworkHeadSlotBigint(page, 60_000)
		expect(slotBaseline, 'head slot in summary when expanded').not.toBeNull()
		expect((slotBaseline ?? 0n) > 0n).toBe(true)

		await step(collapseNetworkEntityView(page))

		await step(expect(page.locator('.network-view-carousel-groups')).toHaveCount(0))
		await step(expect(page.locator('#network-summary-head-block')).toBeVisible())
		await step(expect(page.locator('#network-summary-head-block a[href*="/block/"]')).toBeAttached({
			timeout: 30_000,
		}))

		const headCollapsed = await readNetworkHeadBlockBigint(page, 30_000)
		expect(headCollapsed, 'head block in summary when collapsed').not.toBeNull()
		expect((headCollapsed ?? 0n) > 0n).toBe(true)

		const epochCollapsed = await readNetworkHeadEpochBigint(page, 30_000)
		expect(epochCollapsed, 'head epoch in summary when collapsed').not.toBeNull()

		const slotCollapsed = await readNetworkHeadSlotBigint(page, 30_000)
		expect(slotCollapsed, 'head slot in summary when collapsed').not.toBeNull()
		expect((slotCollapsed ?? 0n) > 0n).toBe(true)

		await step(expect.poll(
			async () => {
				const head = await readNetworkHeadBlockBigint(page, 5_000)
				return head != null && head > (headCollapsed ?? 0n)
			},
			{
				message: 'collapsed summary head block should advance with chain',
				timeout: 180_000,
				intervals: [2_000, 3_000, 4_000, 5_000, 6_000],
			},
		).toBe(true))
	})
})
