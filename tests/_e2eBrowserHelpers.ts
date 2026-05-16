import { expect, type Locator, type Page } from '@playwright/test'

import { TransportType } from '$/constants/TransportType.ts'
import { gatewayUrls } from '$/sources/Ipfs/Rest/constants.ts'
import { jsonRpcUrlWithTransportForChain } from '$/resolvers/Voltaire-JsonRpc.ts'

export { e2eBrowserNewContextOptions } from '../playwright.env.ts'

declare global {
	interface Window {
		__e2eViewTransitionStarts?: number
		__e2eViewTransitionFinishes?: number
		__e2eViewTransitionUpdates?: number
	}
}

const forwardBrowserConsoleLine = (
	type: string,
	text: string,
	location: { url: string, lineNumber: number, columnNumber: number },
) => {
	const locStr = (
		location.url ?
			` ${location.url}:${location.lineNumber}:${location.columnNumber}`
		:	''
	)
	const line = `[browser:${type}]${locStr} ${text}`
	;(
		type === 'error' ?
			console.error(line)
		: type === 'warning' ?
			console.warn(line)
		: type === 'info' ?
			console.info(line)
		: type === 'debug' ?
			console.debug(line)
		:
			console.log(line)
	)
}

export const collectIssues = (page: Page) => {
	const issues: string[] = []
	page.on('console', (msg) => {
		const t = msg.type()
		const text = msg.text()
		const loc = msg.location()
		forwardBrowserConsoleLine(t, text, loc)
		if (t !== 'error')
			return
		// Legacy ignore: hydrate paths historically surfaced resolver “requires query limit”; capped via resolverLoadSubsetRowLimit fallback now.
		if (
			text.includes('[QueryCollection]')
			&& text.includes('requires query limit')
		)
			return
		// Browser network layer: upstream 4xx/5xx and DNS noise on public RPC URLs in e2e (not app throws).
		if (
			text.startsWith('Failed to load resource')
			&& (
				/\b[45]\d\d\b/.test(text)
				|| text.includes('ERR_NAME_NOT_RESOLVED')
			)
		)
			return
		const locStr = (
			loc.url ?
				` ${loc.url}:${loc.lineNumber}:${loc.columnNumber}`
			:	''
		)
		issues.push(`error:${locStr} ${text}`)
	})
	page.on('pageerror', (err) => {
		const line = `[browser:pageerror] ${String(err)}`
		console.error(line)
		issues.push(`pageerror: ${String(err)}`)
	})
	return issues
}

export const clearOriginOpfs = (page: Page) => (
	page.evaluate(async () => {
		const root = await navigator.storage.getDirectory()
		for await (const [name] of root.entries())
			await root.removeEntry(name, { recursive: true })
	})
)

export const chainlistRpcsWire = (url: string) => (
	url.includes('rpcs.json')
	&& (url.includes('chainlist.org') || url.includes('api-proxy/'))
)

/** Matches GETs to public IPFS path gateways (`{origin}/ipfs/…` or `/ipns/…`). */
export const ipfsPublicGatewayGetWire = (url: string) => {
	try {
		const u = new URL(url)
		if (!gatewayUrls.some((origin) => origin === u.origin))
			return false
		return u.pathname.includes('/ipfs/') || u.pathname.includes('/ipns/')
	} catch {
		return false
	}
}

/**
 * Call before `page.goto`. Patches `document.startViewTransition` to count
 * starts and completed transitions (or set both to `-1` when the API is missing).
 */
export const installViewTransitionStartSpy = (page: Page) => (
	page.addInitScript(() => {
		window.__e2eViewTransitionStarts = 0
		window.__e2eViewTransitionFinishes = 0
		window.__e2eViewTransitionUpdates = 0
		if (typeof document.startViewTransition !== 'function') {
			window.__e2eViewTransitionStarts = -1
			window.__e2eViewTransitionFinishes = -1
			window.__e2eViewTransitionUpdates = -1
			return
		}
		const startViewTransition = document.startViewTransition
		const orig = startViewTransition.bind(document)
		document.startViewTransition = (callbackOptions) => {
			window.__e2eViewTransitionStarts = (window.__e2eViewTransitionStarts ?? 0) + 1
			const update: ViewTransitionUpdateCallback = (
				typeof callbackOptions === 'function'
					? callbackOptions
					: () => {}
			)
			const vt = orig(async () => {
				window.__e2eViewTransitionUpdates = (window.__e2eViewTransitionUpdates ?? 0) + 1
				return await update()
			})
			void vt.finished.then(() => {
				window.__e2eViewTransitionFinishes = (window.__e2eViewTransitionFinishes ?? 0) + 1
			}).catch(() => {})
			return vt
		}
	})
)

export const getViewTransitionSpy = (page: Page) => (
	page.evaluate(() => ({
		f: window.__e2eViewTransitionFinishes ?? 0,
		s: window.__e2eViewTransitionStarts ?? 0,
		u: window.__e2eViewTransitionUpdates ?? 0,
	}))
)

export const getViewTransitionStartCount = (page: Page) => (
	page.evaluate(() => window.__e2eViewTransitionStarts ?? 0)
)

export const getViewTransitionFinishCount = (page: Page) => (
	page.evaluate(() => window.__e2eViewTransitionFinishes ?? 0)
)

export const getViewTransitionUpdateCount = (page: Page) => (
	page.evaluate(() => window.__e2eViewTransitionUpdates ?? 0)
)

export const countRequestsMatching = (page: Page, match: (url: string, method: string) => boolean) => {
	let n = 0
	const urls: string[] = []
	const fn = (req: { method: () => string, url: () => string }) => {
		if (match(req.url(), req.method())) {
			n += 1
			urls.push(req.url())
		}
	}
	page.on('request', fn)
	return {
		get: () => n,
		urls,
		detach: () => page.off('request', fn),
	}
}

/** Stubs for `GET …/rpcs.json` in e2e. Includes popular live chains + mainnet HTTP RPCs. */
export const MOCK_CHAINLIST_RPCS_JSON_BODY = JSON.stringify([
	{ chainId: 1, name: 'Mock Ethereum', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, rpc: ['https://ethereum.publicnode.com'] },
	{ chainId: 8453, name: 'Mock Base', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, rpc: ['https://mainnet.base.org'], parent: { type: 'L2', chain: 'eip155:1' } },
	{ chainId: 42161, name: 'Arbitrum One', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, rpc: ['https://arb1.arbitrum.io/rpc'], parent: { type: 'L2', chain: 'eip155:1' } },
	{ chainId: 10, name: 'Optimism', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, rpc: ['https://mainnet.optimism.io'], parent: { type: 'L2', chain: 'eip155:1' } },
	{ chainId: 137, name: 'Polygon', nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }, rpc: ['https://polygon-rpc.com'] },
	{ chainId: 56, name: 'BNB Chain', nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }, rpc: ['https://bsc-dataseed.binance.org'] },
])
export const MOCK_CHAINLIST_RPCS_CHAIN_COUNT = 6

/**
 * Minimal `chains.json` for ethereum-lists (same chain ids as {@link MOCK_CHAINLIST_RPCS_JSON_BODY}).
 * Includes L2 parent links so `/network/1` exercises the Chainlist / ethereum-lists child network subsets.
 */
export const MOCK_ETHEREUM_LISTS_CHAINS_JSON_BODY = JSON.stringify(
	[
		{
			name: 'Mock Ethereum',
			chain: 'ETH',
			rpc: ['https://ethereum.publicnode.com'],
			nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
			shortName: 'eth',
			chainId: 1,
			networkId: 1,
		},
		{
			name: 'Mock Base',
			chain: 'ETH',
			rpc: ['https://mainnet.base.org'],
			nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
			shortName: 'base',
			chainId: 8453,
			networkId: 8453,
			parent: { type: 'L2', chain: 'eip155:1' },
		},
		{
			name: 'Arbitrum One',
			chain: 'ETH',
			rpc: ['https://arb1.arbitrum.io/rpc'],
			nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
			shortName: 'arb1',
			chainId: 42161,
			networkId: 42161,
			parent: { type: 'L2', chain: 'eip155:1' },
		},
		{
			name: 'Optimism',
			chain: 'ETH',
			rpc: ['https://mainnet.optimism.io'],
			nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
			shortName: 'oeth',
			chainId: 10,
			networkId: 10,
			parent: { type: 'L2', chain: 'eip155:1' },
		},
		{
			name: 'Polygon',
			chain: 'MATIC',
			rpc: ['https://polygon-rpc.com'],
			nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
			shortName: 'matic',
			chainId: 137,
			networkId: 137,
		},
		{
			name: 'BNB Chain',
			chain: 'BNB',
			rpc: ['https://bsc-dataseed.binance.org'],
			nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
			shortName: 'bnb',
			chainId: 56,
			networkId: 56,
		},
	],
)

export const ethereumListsChainsJsonWire = (url: string, method: string) => (
	method === 'GET'
	&& url.includes('/chains.json')
	&& !url.includes('rpcs.json')
	&& (
		url.includes('chainid.network')
		|| (url.includes('api-proxy') && url.includes('chainid.network'))
	)
)

/**
 * L2Beat scaling summary — only projects that map to {@link MOCK_CHAINLIST_RPCS_JSON_BODY}
 * chain ids via `chainIdByL2BeatProjectId`, so e2e does not hydrate extra `Network` rows that
 * lack JSON-RPC in the chainlist stub (Voltaire / `collectIssues` console errors).
 */
export const MOCK_L2BEAT_SCALING_SUMMARY_BODY = JSON.stringify({
	projects: {
		arbitrum: {
			id: 'arbitrum',
			name: 'Arbitrum One',
			slug: 'arbitrum',
			type: 'layer2',
			hostChain: 'ethereum',
		},
		base: {
			id: 'base',
			name: 'Base',
			slug: 'base',
			type: 'layer2',
			hostChain: 'ethereum',
		},
		'polygon-pos': {
			id: 'polygon-pos',
			name: 'Polygon PoS',
			slug: 'polygon-pos',
			type: 'layer2',
			hostChain: 'ethereum',
		},
		optimism: {
			id: 'optimism',
			name: 'Optimism',
			slug: 'optimism',
			type: 'layer2',
			hostChain: 'ethereum',
		},
	},
})

export const l2BeatScalingSummaryWire = (url: string, method: string) => (
	method === 'GET'
	&& (
		(url.includes('l2beat.com') && url.includes('/api/scaling/summary'))
		|| (
			url.includes('api-proxy/')
			&& url.includes('l2beat.com')
			&& url.includes('scaling/summary')
		)
	)
)

const publicJsonRpcWire = (url: string, method: string) => (
	method === 'POST'
	&& (
		url === 'https://ethereum.publicnode.com/'
		|| url === 'https://mainnet.base.org/'
		|| url === 'https://arb1.arbitrum.io/rpc'
		|| url === 'https://mainnet.optimism.io/'
		|| url === 'https://polygon-rpc.com/'
		|| url === 'https://bsc-dataseed.binance.org/'
		|| url === 'https://eth.llamarpc.com/'
		|| url === 'https://base.llamarpc.com/'
		|| url === 'https://binance.llamarpc.com/'
	)
)

/** TradingView crypto scanner `POST /crypto/scan` (browser hits dev `api-proxy/…` or origin). */
export const tradingViewCryptoScanWire = (url: string, method: string) => (
	method === 'POST'
	&& url.includes('/crypto/scan')
	&& (
		url.includes('scanner.tradingview.com')
		|| (url.includes('api-proxy') && url.includes('scanner.tradingview'))
	)
)

export const installChainlistRpcsJsonStub = async (page: Page) => {
	await page.route('**/*', async (route) => {
		const url = route.request().url()
		const method = route.request().method()
		if (method === 'GET' && ipfsPublicGatewayGetWire(url)) {
			await route.fulfill({
				status: 200,
				contentType: 'text/plain; charset=utf-8',
				body: 'e2e ipfs gateway stub',
			})
			return
		}
		if (chainlistRpcsWire(url)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: MOCK_CHAINLIST_RPCS_JSON_BODY,
			})
			return
		}
		if (ethereumListsChainsJsonWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: MOCK_ETHEREUM_LISTS_CHAINS_JSON_BODY,
			})
			return
		}
		if (l2BeatScalingSummaryWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: MOCK_L2BEAT_SCALING_SUMMARY_BODY,
			})
			return
		}
		if (publicJsonRpcWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					jsonrpc: '2.0',
					id: 1,
					result: '0x1',
				}),
			})
			return
		}
		if (tradingViewCryptoScanWire(url, method)) {
			let tickers: string[] = []
			try {
				const post = route.request().postDataJSON()
				const list = post?.symbols?.tickers
				if (Array.isArray(list))
					tickers = list.filter((t): t is string => typeof t === 'string')
			} catch {
				//
			}
			const data = tickers.map((ticker) => ({
				s: ticker,
				d: [
					`e2e-${ticker}`,
					1,
					'streaming',
				],
			}))
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ data }),
			})
			return
		}
		await route.continue()
	})
}

export const assertMainSettled = async (
	page: Page,
	timeoutMs = 180_000,
) => {
	await expect(page.locator('#main [role="alert"]')).toHaveCount(0, { timeout: timeoutMs })
	await expect(page.locator('#main .loading')).toHaveCount(0, { timeout: timeoutMs })
}

/**
 * Proves `resolveLive` started Voltaire’s subscription (layout mounted). WSS can still drop in CI/Playwright; use for smoke tests with stubbed chainlist.
 * Register the returned promise *before* `page.goto` so the first line is not missed.
 */
export const voltaireBlockStreamWatchStartConsoleEvent = (page: Page, timeoutMs = 30_000) => (
	page.waitForEvent('console', {
		predicate: (msg) => {
			const t = msg.text()
			return t.includes('[Voltaire]') && t.includes('block stream watch start')
		},
		timeout: timeoutMs,
	})
)

/**
 * Wait for a single console line with `[block stream] … type=blocks`. Prefer the combined gate in `tests/e2e/_networkViewLiveE2e.ts` (log or head tick) for real runs — WSS often never emits in Playwright.
 * Register the returned promise *before* `page.goto` so the first event is not missed.
 */
export const blockStreamBlocksConsoleEvent = (page: Page, timeoutMs = 90_000) => (
	page.waitForEvent('console', {
		predicate: (msg) => {
			const t = msg.text()
			return t.includes('[block stream]') && t.includes('type=blocks')
		},
		timeout: timeoutMs,
	})
)

/**
 * HTTP JSON-RPC URL aligned with app `jsonRpcUrlWithTransportForChain` (ExecutionEndpoints, then Chainlist). Playwright preflight uses `fetch` only — if the default is WebSocket, falls back to Chainlist HTTP.
 */
export const publicJsonRpcHttpUrlForChainE2e = async (chainId: number) => {
	const t = await jsonRpcUrlWithTransportForChain(chainId)
	if (t == null) return null
	if (t.transportType === TransportType.Http) return t.rpcUrl
	const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
	const chain = (await fetchRpcsJson()).find((candidate) => candidate.chainId === chainId)
	if (chain == null) return null
	for (const entry of chain.rpc ?? []) {
		const raw = typeof entry === 'string' ? entry : entry.url
		const url = raw?.trim()
		if (url && url.startsWith('http')) return url
	}
	return null
}

/** In-browser public RPC check — matches client `fetch` + `corsEnabled: true` (not `/api-proxy`). Two `eth_blockNumber` samples; fail-fast when the chain is stuck or rate-limited (429). */
export const preflightChainHeadAdvances = async (
	page: Page,
	rpcUrl: string,
	gapMs: number,
) => {
	const a = await preflightPublicJsonRpcEthBlockNumber(page, rpcUrl)
	if (!a.ok || a.blockNumberHex == null) return { ok: false as const, reason: 'first', detail: a }
	const h0 = BigInt(a.blockNumberHex)
	await page.waitForTimeout(gapMs)
	const b = await preflightPublicJsonRpcEthBlockNumber(page, rpcUrl)
	if (!b.ok || b.blockNumberHex == null) return { ok: false as const, reason: 'second', detail: b }
	const h1 = BigInt(b.blockNumberHex)
	if (h1 <= h0) return { ok: false as const, reason: 'stuck', h0, h1 }
	return { ok: true as const, h0, h1 }
}

/**
 * Retries in-browser public RPC preflight (429, transient DNS, or slow blocks) before failing the test.
 */
export const preflightChainHeadAdvancesWithRetries = async (
	page: Page,
	rpcUrl: string,
	gapMs: number,
	{
		attempts = 8,
		betweenAttemptsMs = 4_000,
	}: { attempts?: number, betweenAttemptsMs?: number } = {},
) => {
	let last: Awaited<ReturnType<typeof preflightChainHeadAdvances>> | undefined
	for (let i = 0; i < attempts; i += 1) {
		last = await preflightChainHeadAdvances(page, rpcUrl, gapMs)
		if (last.ok) return last
		if (i < attempts - 1) await page.waitForTimeout(betweenAttemptsMs)
	}
	if (last === undefined) throw new Error('preflightChainHeadAdvancesWithRetries: no attempt ran')
	return last
}

export const preflightPublicJsonRpcEthBlockNumber = (
	page: Page,
	rpcUrl: string,
) => (
	page.evaluate(async (url) => {
		try {
			const res = await fetch(
				url,
				{
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify(
						{
							jsonrpc: '2.0',
							id: 1,
							method: 'eth_blockNumber',
							params: [] as const,
						},
					),
				},
			)
			if (!res.ok) return { ok: false, status: res.status }
			const j: { result?: string, error?: { message?: string } } = await res.json()
			const hex = j?.result
			if (typeof hex !== 'string' || !hex.startsWith('0x')) return { ok: false, status: res.status, error: j.error?.message }
			return { ok: true, blockNumberHex: hex }
		} catch (e) {
			return { ok: false, error: e instanceof Error ? e.message : String(e) }
		}
	}, rpcUrl)
)

export const readNetworkHeadBlockBigint = (page: Page) => (
	page
		.locator('[data-e2e="network-summary-head-block"]')
		.innerText()
		.then(
			(t) => {
				const s = t.trim()
				if (s.length === 0) return null
				try {
					return BigInt(s)
				} catch {
					return null
				}
			},
		)
)

const blockPathNumberFromHref = (href: string | null) => {
	if (href == null) return null
	const m = /\/block\/([0-9]+)\b/.exec(href)
	if (m == null) return null
	try {
		return BigInt(m[1])
	} catch {
		return null
	}
}

export const readTopBlockNumberFromNetworkCarousel = async (
	page: Page,
	linkWaitMs = 90_000,
) => {
	const first = page.locator('[data-scroll-marker-label="Blocks"] a[href*="/block/"]').first()
	await first.waitFor({ state: 'visible', timeout: linkWaitMs })
	return blockPathNumberFromHref(await first.getAttribute('href'))
}

/** Top block link on `/network/:id/blocks` (`EvmBlocksView` inner list `article#…-items`). */
export const readTopBlockNumberFromNetworkBlocksPage = async (
	page: Page,
	linkWaitMs = 120_000,
) => {
	const first = page.locator('#blocks-items a[href*="/block/"]').first()
	await first.waitFor({ state: 'visible', timeout: linkWaitMs })
	return blockPathNumberFromHref(await first.getAttribute('href'))
}

/** Block numbers from visible carousel links, in DOM order (per list implementation). */
export const readNetworkCarouselBlockNumbers = async (page: Page) => {
	const links = page.locator('[data-scroll-marker-label="Blocks"] a[href*="/block/"]')
	const n = await links.count()
	const out: bigint[] = []
	for (let i = 0; i < n; i++) {
		const href = await links.nth(i).getAttribute('href')
		const b = blockPathNumberFromHref(href)
		if (b != null) out.push(b)
	}
	return out
}

export const readTxHrefsJoin = async (page: Page) => {
	const list = page.locator('[data-scroll-marker-label="Transactions"] a[href*="/tx/"]')
	const n = await list.count()
	if (n === 0) return ''
	const all = await list.evaluateAll(
		(els) => (
			els.map((a) => (
				a instanceof HTMLAnchorElement ?
					(a.getAttribute('href') ?? '')
				:
					''
			))
		),
	)
	return all.join('\0')
}

export const expandClosedAncestors = async (link: Locator) => {
	await link.evaluate((el) => {
		const closed: HTMLDetailsElement[] = []
		for (let n = el.parentElement; n; n = n.parentElement) {
			if (n instanceof HTMLDetailsElement && !n.hasAttribute('open'))
				closed.push(n)
		}
		for (const d of closed.slice().reverse()) {
			const summary = d.querySelector(':scope > summary')
			if (summary instanceof HTMLElement) summary.click()
		}
	})
}

export const orderedInternalNavHrefs = (menu: Locator) => (
	menu.evaluate((root) => {
		const out: string[] = []
		const seen = new Set<string>()
		for (const a of root.querySelectorAll('a[href^="/"]')) {
			const h = a.getAttribute('href')
			if (h != null && !seen.has(h)) {
				seen.add(h)
				out.push(h)
			}
		}
		return out
	})
)

export const navMenu = (page: Page) => page.locator('#nav-menu')

export const chunk = <T,>(arr: T[], size: number): T[][] => (
	arr.reduce<T[][]>((acc, item, j) => {
		const idx = Math.floor(j / size)
		acc[idx] ??= []
		acc[idx].push(item)
		return acc
	}, [])
)

export const clickInternalNavHrefs = async (
	page: Page,
	menu: Locator,
	hrefs: string[],
) => {
	for (const href of hrefs) {
		await expandClosedAncestors(menu.locator(`a[href="${href}"]`).first())
		const link = menu.locator(`a[href="${href}"]`).first()
		await link.evaluate((el) => {
			if (el instanceof HTMLAnchorElement) el.click()
		})
		await expect(page).toHaveURL((u) => new URL(u).pathname === href, { timeout: 15_000 })
		await expect(page.locator('body')).toBeVisible({ timeout: 5_000 })
		await assertMainSettled(page)
	}
}
