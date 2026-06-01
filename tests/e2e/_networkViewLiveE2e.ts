import { expect, type ConsoleMessage, type Page } from '@playwright/test'

import {
	assertMainSettled,
	clearOriginOpfs,
	collectIssues,
	installChainlistRpcsJsonStub,
	jsonStringifyForExpectMessage,
	preflightChainHeadAdvancesWithRetries,
	publicJsonRpcHttpUrlForChainE2e,
	readNetworkCarouselBlockNumbers,
	readNetworkHeadBlockBigint,
	readTopBlockNumberFromNetworkCarousel,
	readTxHrefsJoin,
} from '../_e2eBrowserHelpers.ts'

export const pageErrors = (issues: string[]) => (
	issues.filter((i) => i.startsWith('pageerror:'))
)

export type NetworkViewLiveE2EChain = {
	chainId: number
	label: string
	/** Basescan must not be hit as Blockscout v2 (regression; Base only). */
	enforceBasescanNotViaApiProxy: boolean
}

/**
 * End-to-end: head label advances, Voltaire live (console `type=blocks` and/or head tick; WSS is flaky in Playwright), carousels track head, tx list can refresh.
 * Fails if public RPC preflights never advance (retries) or explorer never shows head/tx links.
 */
export const runNetworkViewLiveE2E = async (page: Page, chain: NetworkViewLiveE2EChain) => {
	await installChainlistRpcsJsonStub(page)

	const { chainId, enforceBasescanNotViaApiProxy, label: _label } = chain
	const publicRpcUrlRaw = await publicJsonRpcHttpUrlForChainE2e(chainId)
	expect(
		publicRpcUrlRaw,
		`no HTTP JSON-RPC for chain ${String(chainId)} (ExecutionEndpoints / Chainlist)`,
	).not.toBeNull()
	if (publicRpcUrlRaw == null) {
		throw new Error(`no HTTP JSON-RPC for chain ${String(chainId)} (ExecutionEndpoints / Chainlist)`)
	}
	const publicRpcUrl = publicRpcUrlRaw
	const preflight = await preflightChainHeadAdvancesWithRetries(
		page,
		publicRpcUrl,
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

	const blockscoutToBasescanV2: string[] = []
	const onRequest = (req: { url: () => string }) => {
		const u = req.url()
		if (
			enforceBasescanNotViaApiProxy
			&& u.includes('/api-proxy/')
			&& u.includes('basescan.org')
			&& u.includes('/api/v2')
		) blockscoutToBasescanV2.push(u)
	}
	if (enforceBasescanNotViaApiProxy) {
		page.on('request', onRequest)
	}

	const issues = collectIssues(page)
	let sawBlockStreamTypeBlocks = false
	const onBlockStreamTypeBlocks = (msg: ConsoleMessage) => {
		const t = msg.text()
		if (t.includes('[block stream]') && t.includes('type=blocks')) {
			sawBlockStreamTypeBlocks = true
		}
	}
	page.on('console', onBlockStreamTypeBlocks)
	try {
		await page.goto('/', { waitUntil: 'domcontentloaded' })
		await clearOriginOpfs(page)
		await page.goto(`/network/${String(chainId)}`, { waitUntil: 'load' })
		await expect(page.locator('#main')).toBeVisible()
		await assertMainSettled(page, 120_000)

		await expect(page.locator('#network-summary-head-block')).toBeVisible(
			{ timeout: 45_000 },
		)
		const headBaseline = await readNetworkHeadBlockBigint(page)
		expect(headBaseline, 'head after settle').not.toBeNull()
		expect((headBaseline ?? 0n) > 0n).toBe(true)

		await expect.poll(
			async () => {
				if (sawBlockStreamTypeBlocks) {
					return true
				}
				const h = await readNetworkHeadBlockBigint(page)
				return h != null && h > (headBaseline ?? 0n)
			},
			{
				timeout: 120_000,
				intervals: [1_000, 2_000, 2_000, 3_000, 3_000, 5_000],
			},
		).toBe(true)

		const head0 = await readNetworkHeadBlockBigint(page)
		expect(head0, 'initial head').not.toBeNull()
		expect((head0 ?? 0n) > 0n).toBe(true)

		await expect.poll(
			async () => {
				const t = await readNetworkHeadBlockBigint(page)
				return t == null ? null : t > (head0 ?? 0n)
			},
			{
				timeout: 120_000,
				intervals: [2_000, 2_000, 3_000, 4_000, 5_000],
			},
		).toBe(true)

		const head1 = await readNetworkHeadBlockBigint(page)
		expect(head1, 'head after tick').not.toBeNull()
		expect((head1 ?? 0n) > (head0 ?? 0n)).toBe(true)

		await expect(page.locator('[data-scroll-marker-label="Blocks"]')).toBeAttached({ timeout: 120_000 })
		await expect(page.locator('[data-scroll-marker-label="Transactions"]')).toBeAttached({ timeout: 120_000 })

		await expect.poll(
			async () => {
				const top = await readTopBlockNumberFromNetworkCarousel(page, 120_000)
				const h = await readNetworkHeadBlockBigint(page)
				if (top == null || h == null) return false
				return top === h
			},
			{
				timeout: 120_000,
				intervals: [1_000, 2_000, 2_000, 3_000, 4_000],
			},
		).toBe(true)

		const numsAfterHeadTick = await readNetworkCarouselBlockNumbers(page)
		expect(numsAfterHeadTick.length > 0).toBe(true)
		const maxCarousel = numsAfterHeadTick.reduce(
			(a, b) => (a > b ? a : b),
			0n,
		)
		expect(maxCarousel >= (head1 ?? 0n)).toBe(true)

		await expect(
			page.locator(
				'.network-carousel-execution[data-scroll-container~="layout-carousel"] a[href*="/tx/"]',
			).first(),
		).toBeVisible({ timeout: 90_000 })

		const txBefore = await readTxHrefsJoin(page)
		expect(
			txBefore.length,
			'expected transaction links after tx carousel row is visible',
		).toBeGreaterThan(0)

		await expect.poll(
			async () => (await readTxHrefsJoin(page)) !== txBefore,
			{
				timeout: 90_000,
				intervals: [2_000, 3_000, 5_000, 5_000],
			},
		).toBe(true)

		const carouselBeforeSecondAdvance = await readNetworkCarouselBlockNumbers(page)
		const topBefore = carouselBeforeSecondAdvance.reduce(
			(a, b) => (a > b ? a : b),
			carouselBeforeSecondAdvance[0] ?? 0n,
		)

		await expect.poll(
			async () => {
				const t = await readNetworkHeadBlockBigint(page)
				return t == null ? false : t > (head1 ?? 0n)
			},
			{
				timeout: 120_000,
				intervals: [2_000, 3_000, 4_000, 5_000],
			},
		).toBe(true)

		const head2 = await readNetworkHeadBlockBigint(page)
		expect(head2, 'head2').not.toBeNull()
		expect((head2 ?? 0n) > (head1 ?? 0n)).toBe(true)

		await expect.poll(
			async () => {
				const nums = await readNetworkCarouselBlockNumbers(page)
				if (nums.length === 0) return false
				const top = nums.reduce((a, b) => (a > b ? a : b), nums[0])
				return top >= (head2 ?? 0n) || top > topBefore
			},
			{
				timeout: 120_000,
				intervals: [1_000, 2_000, 3_000, 4_000],
			},
		).toBe(true)

		expect(
			pageErrors(issues),
			pageErrors(issues).join('\n'),
		).toEqual([])

		if (enforceBasescanNotViaApiProxy) {
			expect(
				blockscoutToBasescanV2,
				`Basescan must not be called as Blockscout v2: ${blockscoutToBasescanV2.join('\n')}`,
			).toEqual([])
		}
	} finally {
		if (enforceBasescanNotViaApiProxy) {
			page.off('request', onRequest)
		}
		page.off('console', onBlockStreamTypeBlocks)
	}
}
