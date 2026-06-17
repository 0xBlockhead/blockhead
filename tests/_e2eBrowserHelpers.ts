import { expect, type Locator, type Page } from '@playwright/test'

import { ipfsPublicGateways } from '$/constants/IpfsProtocol.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { gatewayUrls as swarmGatewayUrls } from '$/sources/Swarm/Rest/constants.ts'
import { voltaireJsonRpcUrlWithTransportForChain } from '$/sources/Voltaire/index.ts'

export { e2eBrowserNewContextOptions } from '../playwright.env.ts'

export const jsonStringifyForExpectMessage = (
	value: Parameters<typeof JSON.stringify>[0]
) => (
	JSON.stringify(
		value,
		(_key, nested) => (
			typeof nested === 'bigint' ?
				nested.toString()
			:
				nested
		)
	)
)

declare global {
	interface Window {
		__e2eViewTransitionStarts?: number
		__e2eViewTransitionFinishes?: number
		__e2eViewTransitionUpdates?: number
		__blockheadClientProbe?: BlockheadClientProbe
		__blockheadPersistenceProbe?: BlockheadPersistenceProbeEvent[]
		__blockheadProductDataSchemaVersionOverride?: number
		__blockheadBoundaryProbe?: BoundaryUpdateEvent[]
	}
}

export type BoundaryUpdateEvent = {
	at: number
	kind: (
		| 'console-failed'
		| 'console-uncaught'
		| 'dom-failed'
		| 'dom-loading'
		| 'dom-resolved'
	)
	key: string | null
	message: string
}

export type BoundaryDomRow = {
	key: string | null
	state: 'failed' | 'loading'
	message: string
}

export type BoundaryMainSnapshot = {
	failed: BoundaryDomRow[]
	loading: BoundaryDomRow[]
	empty: boolean
	emptyReason: string | null
	textLength: number
	contentMarkerCount: number
}

export type RouteBoundaryReport = {
	pathname: string
	finalUrl: string
	mainVisible: boolean
	updates: BoundaryUpdateEvent[]
	snapshot: BoundaryMainSnapshot
	issues: string[]
}

export type ProductCollectionSyncEvent = {
	collection:
		| {
			kind: 'Entity'
			entityType: string
			id: string
		}
		| {
			kind: 'Field' | 'Count'
			entityType: string
			fieldName: string
			id: string
		}
	key: string
}

export type ProductCollectionSizes = {
	loadedSubsets: number
	entities: Record<string, number>
	fields: Record<string, Record<string, number>>
	counts: Record<string, Record<string, number>>
}

export type ProductSubscribeError = {
	selectorAddress: readonly string[]
	dimension: string
	entityType: string
	fieldName?: string
	message: string
}

export type ClientProbeResource<_Result> = Promise<_Result> & {
	readonly current: _Result | undefined
	readonly error: readonly ProductSubscribeError[] | undefined
	readonly loading: boolean
	readonly ready: boolean
	subscribe: (listener: () => void) => () => void
}

export type ProductProbePayload = {
	fields: {
		name?: string
		$$rpcUrls?: {
			values: readonly object[]
			totalCount?: number
		}
	}
}

export type BlockheadClientProbe = {
	events: {
		collectionSync: ProductCollectionSyncEvent[]
	}
	collectionSizes: () => {
		loadedSubsets: number
		entities: Record<string, number>
		fields: Record<string, Record<string, number>>
		counts: Record<string, Record<string, number>>
	}
	queryStates: () => {
		key: string[]
		status: string
		fetchStatus: string
		error?: string
	}[]
	read: (
		entityType: string,
		entitySelector: object,
		selection: object
	) => ClientProbeResource<ProductProbePayload>
}

export type BlockheadPersistenceProbeDecision = (
	| 'hydrated-rows'
	| 'loaded-marker'
	| 'snapshot'
	| 'remote'
)

export type BlockheadPersistenceProbeEvent = (
	| {
		kind: 'loadSubset'
		collectionId: string
		decision: BlockheadPersistenceProbeDecision
		loadedKey: string
		at: number
	}
	| {
		kind: 'queryFn'
		collectionId: string
		loadedKey: string
		at: number
	}
	| {
		kind: 'markLoaded'
		collectionId: string
		loadedKey: string
		at: number
	}
)

export const networksCatalogFieldCollectionId = 'EntityFieldCollection:_Global:$$networks'

export const installPersistenceProbe = (page: Page) => (
	page.addInitScript((storageKey) => {
		const stored = sessionStorage.getItem(storageKey)
		window.__blockheadPersistenceProbe = (
			stored != null && stored !== '' ?
				JSON.parse(stored)
			:
				[]
		)
	}, '__blockheadPersistenceProbe')
)

export const clearPersistenceProbe = (page: Page) => (
	page.evaluate(() => {
		sessionStorage.removeItem('__blockheadPersistenceProbe')
		window.__blockheadPersistenceProbe = []
	})
)

export const getPersistenceProbeEvents = (page: Page) => (
	page.evaluate(() => (
		window.__blockheadPersistenceProbe ?? []
	))
)

export const persistenceShortCircuitDecisions: readonly BlockheadPersistenceProbeDecision[] = [
	'hydrated-rows',
	'loaded-marker',
	'snapshot',
]

export const waitForPersistenceMarkLoaded = (
	page: Page,
	collectionId: string
) => (
	page.waitForFunction(
		(expectedCollectionId) => (
			(window.__blockheadPersistenceProbe ?? []).some((event) => (
				event.kind === 'markLoaded'
				&& event.collectionId === expectedCollectionId
			))
		),
		collectionId,
		{ timeout: 120_000 }
	)
)

export const waitForPersistenceShortCircuit = (
	page: Page,
	collectionId: string,
	options?: {
		startIndex?: number
		loadedKey?: string
	}
) => (
	page.waitForFunction(
		({
			expectedCollectionId,
			fromIndex,
			expectedLoadedKey,
			shortCircuitDecisions,
		}) => (
			(window.__blockheadPersistenceProbe ?? [])
				.slice(fromIndex)
				.some((event) => (
					event.kind === 'loadSubset'
					&& event.collectionId === expectedCollectionId
					&& shortCircuitDecisions.includes(event.decision)
					&& (
						expectedLoadedKey == null
						|| event.loadedKey === expectedLoadedKey
					)
				))
		),
		{
			expectedCollectionId: collectionId,
			fromIndex: options?.startIndex ?? 0,
			expectedLoadedKey: options?.loadedKey,
			shortCircuitDecisions: persistenceShortCircuitDecisions,
		},
		{ timeout: 120_000 }
	)
)

export const persistenceMarkLoadedEvent = (
	events: BlockheadPersistenceProbeEvent[],
	collectionId: string
) => (
	events.find((event) => (
		event.kind === 'markLoaded'
		&& event.collectionId === collectionId
	))
)

export const installBoundaryProbe = (page: Page) => (
	page.addInitScript(() => {
		const rowMessage = (element: Element) => {
			const ariaLabel = element.getAttribute('aria-label')?.trim()
			if (ariaLabel)
				return ariaLabel.slice(0, 500)
			return (
				element.textContent.replace(/\s+/g, ' ').trim().slice(0, 500)

			)
		}

		const domKindForElement = (element: Element) => (
			element.matches('[data-error], [role="alert"]') ?
				'dom-failed' as const
			:
				element.matches('[data-tag].inline-placeholder:not([aria-busy="true"])') ?
					'dom-failed' as const
				:
					element.matches('.loading, [aria-busy="true"]') ?
						'dom-loading' as const
					:
						null
		)

		window.__blockheadBoundaryProbe = []

		const pushBoundaryEvent = (
			kind: BoundaryUpdateEvent['kind'],
			key: string | null,
			message: string
		) => {
			(window.__blockheadBoundaryProbe ??= []).push({
				at: Date.now(),
				kind,
				key,
				message,
			})
		}

		const origConsoleError = console.error
		console.error = (...args: Parameters<typeof console.error>) => {
			const text = args.map((arg) => String(arg)).join(' ')
			if (text.includes('[blockhead:boundary:uncaught]')) {
				const keyMatch = text.match(/\[blockhead:boundary:uncaught\]\s+(\S+)/)
				pushBoundaryEvent(
					'console-uncaught',
					keyMatch?.[1] ?? null,
					text
				)
			}
			else if (text.includes('[blockhead:boundary]')) {
				const keyMatch = text.match(/\[blockhead:boundary\]\s+(\S+)/)
				pushBoundaryEvent(
					'console-failed',
					keyMatch?.[1] ?? null,
					text
				)
			}
			origConsoleError.apply(console, args)
		}

		const observeBoundaryNode = (node: Node) => {
			if (!(node instanceof Element)) return

			const candidates = (
				node.matches('[data-error], [role="alert"], [data-tag].inline-placeholder, .loading, [aria-busy="true"]') ?
					[node]
				:
					[...node.querySelectorAll('[data-error], [role="alert"], [data-tag].inline-placeholder, .loading, [aria-busy="true"]')]
			)

			for (const element of candidates) {
				const kind = domKindForElement(element)
				if (kind == null) continue
				pushBoundaryEvent(
					kind,
					element.getAttribute('data-error'),
					rowMessage(element)
				)
			}
		}

		const observeResolvedNode = (node: Node) => {
			if (!(node instanceof Element)) return
			pushBoundaryEvent(
				'dom-resolved',
				node.getAttribute('data-error'),
				rowMessage(node)
			)
		}

		const attachMainObserver = (main: Element) => {
			const observer = new MutationObserver((records) => {
				for (const record of records) {
					for (const node of record.addedNodes)
						observeBoundaryNode(node)
					for (const node of record.removedNodes) {
						if (
							node instanceof Element
							&& (
								node.matches('[data-error], [role="alert"], [data-tag].inline-placeholder, .loading, [aria-busy="true"]')
								|| node.querySelector('[data-error], [role="alert"], [data-tag].inline-placeholder, .loading, [aria-busy="true"]')
							)
						) observeResolvedNode(node)
					}
				}
			})
			observer.observe(main, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: [
					'data-error',
					'aria-busy',
					'class',
				],
			})
			observeBoundaryNode(main)
		}

		const tryAttach = () => {
			const main = document.querySelector('#main')
			if (main != null) {
				attachMainObserver(main)
				return true
			}
			return false
		}

		if (!tryAttach()) {
			const bootObserver = new MutationObserver(() => {
				if (tryAttach())
					bootObserver.disconnect()
			})
			bootObserver.observe(document, {
				childList: true,
				subtree: true,
			})
		}
	})
)

export const resetBoundaryProbe = (page: Page) => (
	page.url().startsWith('about:') ?
		Promise.resolve()
	:
		page.evaluate(() => {
		window.__blockheadBoundaryProbe = []
		}).catch(() => {})
)

export const clearBoundaryProbe = resetBoundaryProbe

export const getBoundaryProbeEvents = (page: Page) => (
	page.evaluate(() => (
		window.__blockheadBoundaryProbe ?? []
	))
)

export const snapshotBoundaryMain = (page: Page) => (
	page.evaluate(() => {
		const rowMessage = (element: Element) => {
			const ariaLabel = element.getAttribute('aria-label')?.trim()
			if (ariaLabel)
				return ariaLabel.slice(0, 500)
			return (
				element.textContent.replace(/\s+/g, ' ').trim().slice(0, 500)

			)
		}

		const main = document.querySelector('#main')
		if (main == null)
			return {
				failed: [],
				loading: [],
				empty: true,
				emptyReason: 'no-main',
				textLength: 0,
				contentMarkerCount: 0,
			} satisfies BoundaryMainSnapshot

		const failed = [
			...main.querySelectorAll('[data-error], [role="alert"]'),
			...main.querySelectorAll('[data-tag].inline-placeholder:not([aria-busy="true"])'),
		].map((element) => ({
			key: (
				element.getAttribute('data-error')
				?? element.getAttribute('aria-label')
			),
			state: 'failed' as const,
			message: rowMessage(element),
		}))

		const loading = [...main.querySelectorAll('.loading, [aria-busy="true"]')].map((element) => ({
			key: element.getAttribute('data-error'),
			state: 'loading' as const,
			message: rowMessage(element),
		}))

		const contentMarkerCount = main.querySelectorAll(
			'section, dl, ul, ol, [data-card], h1, h2, h3, table, pre, canvas'
			).length
		const textLength = main.textContent.replace(/\s+/g, ' ').trim().length

		const empty = (
			failed.length === 0
			&& loading.length === 0
			&& contentMarkerCount === 0
			&& textLength < 24
		)

		return {
			failed,
			loading,
			empty,
			emptyReason: (
				empty ?
					(
						textLength === 0 ?
							'main-has-no-text'
						:
							'main-has-no-content-markers'
					)
				:
					null
			),
			textLength,
			contentMarkerCount,
		} satisfies BoundaryMainSnapshot
	})
)

export const waitForBoundarySettle = async (
	page: Page,
	{
		timeoutMs = 180_000,
		quietMs = 4_000,
	}: {
		timeoutMs?: number
		quietMs?: number
	} = {}
) => {
	const deadline = Date.now() + timeoutMs
	let lastSignature = ''
	let quietSince = Date.now()

	while (Date.now() < deadline) {
		let snapshot: BoundaryMainSnapshot
		let events: BoundaryUpdateEvent[]
		try {
			snapshot = await snapshotBoundaryMain(page)
			events = await getBoundaryProbeEvents(page)
		}
		catch {
			return snapshotBoundaryMain(page).catch(() => ({
				failed: [],
				loading: [],
				empty: true,
				emptyReason: 'page-closed',
				textLength: 0,
				contentMarkerCount: 0,
			}))
		}
		const signature = JSON.stringify({
			loading: snapshot.loading.length,
			failed: snapshot.failed.length,
			events: events.length,
		})

		if (
			signature === lastSignature
			&& snapshot.loading.length === 0
		) {
			if (Date.now() - quietSince >= quietMs)
				return snapshot
		}
		else {
			lastSignature = signature
			quietSince = Date.now()
		}

		await page.waitForTimeout(250)
	}

	return snapshotBoundaryMain(page)
}

export const summarizeRouteBoundaryReport = (
	pathname: string,
	finalUrl: string,
	mainVisible: boolean,
	updates: BoundaryUpdateEvent[],
	snapshot: BoundaryMainSnapshot
) => {
	const issues: string[] = []

	if (!mainVisible)
		issues.push('main-not-visible')

	for (const row of snapshot.failed) {
		issues.push(
			`failed:${row.key ?? 'unknown'}:${row.message || '(no message)'}`
		)
	}

	for (const row of snapshot.loading) {
		issues.push(
			`still-loading:${row.key ?? 'unknown'}:${row.message || '(no message)'}`
		)
	}

	if (snapshot.empty)
		issues.push(`empty:${snapshot.emptyReason ?? 'unknown'}`)

	const consoleFailures = updates.filter((event) => (
		event.kind === 'console-failed'
		|| event.kind === 'console-uncaught'
	))

	for (const event of consoleFailures) {
		const token = `console:${event.kind}:${event.key ?? 'unknown'}`
		if (!issues.some((issue) => issue.includes(event.key ?? 'unknown') && issue.startsWith('failed:')))
			issues.push(`${token}:${event.message}`)
	}

	return {
		pathname,
		finalUrl,
		mainVisible,
		updates,
		snapshot,
		issues,
	} satisfies RouteBoundaryReport
}

export const formatBoundaryReportSummary = (
	reports: RouteBoundaryReport[],
	optionalPathnames: ReadonlySet<string> = new Set()
) => {
	const failedRoutes = reports.filter((report) => (
		report.snapshot.failed.length > 0
		|| report.updates.some((event) => (
			event.kind === 'console-failed'
			|| event.kind === 'console-uncaught'
		))
	))
	const emptyRoutes = reports.filter((report) => report.snapshot.empty)
	const loadingRoutes = reports.filter((report) => report.snapshot.loading.length > 0)
	const issueRoutes = reports.filter((report) => report.issues.length > 0)
	const optionalIssueRoutes = issueRoutes.filter((report) => optionalPathnames.has(report.pathname))
	const blockingIssueRoutes = issueRoutes.filter((report) => !optionalPathnames.has(report.pathname))

	const lines = [
		`routes ${reports.length}`,
		`with issues ${issueRoutes.length}`,
		`blocking ${blockingIssueRoutes.length}`,
		`optional-live ${optionalIssueRoutes.length}`,
		`failed ${failedRoutes.length}`,
		`still loading ${loadingRoutes.length}`,
		`empty ${emptyRoutes.length}`,
		'',
	]

	if (failedRoutes.length > 0) {
		lines.push('Failed boundaries:')
		for (const report of failedRoutes) {
			const tag = optionalPathnames.has(report.pathname) ? ' (optional-live)' : ''
			lines.push(`  ${report.pathname}${tag}`)
			for (const row of report.snapshot.failed)
				lines.push(`    [dom] ${row.key ?? 'unknown'}: ${row.message}`)
			for (const event of report.updates.filter((entry) => (
				entry.kind === 'console-failed'
				|| entry.kind === 'console-uncaught'
			)))
				lines.push(`    [${event.kind}] ${event.key ?? 'unknown'}: ${event.message}`)
		}
		lines.push('')
	}

	if (loadingRoutes.length > 0) {
		lines.push('Still loading after settle:')
		for (const report of loadingRoutes) {
			lines.push(`  ${report.pathname}`)
			for (const row of report.snapshot.loading)
				lines.push(`    ${row.key ?? 'unknown'}: ${row.message}`)
		}
		lines.push('')
	}

	if (emptyRoutes.length > 0) {
		lines.push('Empty main after settle:')
		for (const report of emptyRoutes)
			lines.push(`  ${report.pathname} (${report.snapshot.emptyReason ?? 'unknown'})`)
		lines.push('')
	}

	return lines.join('\n')
}

export const waitForNetworksListRendered = async (page: Page) => {
	const networks = page.locator('#networks, [id="networks:evm"]').first()
	await expect(networks).toBeVisible({ timeout: 120_000 })
	await expect(networks.getByText('Loading networks…')).toHaveCount(
		0,
		{ timeout: 120_000 }
	)
	await expect(networks.locator('a[href$="/network/eip155:1"], a[href$="/network/ethereum"]').first()).toBeAttached({
		timeout: 120_000,
	})
}

const forwardBrowserConsoleLine = (
	type: string,
	text: string,
	location: {
		url: string
		lineNumber: number
		columnNumber: number
	}
) => {
	const locStr = (
		location.url ?
			` ${location.url}:${location.lineNumber}:${location.columnNumber}`
		:
			''
	)
	const line = `[browser:${type}]${locStr} ${text}`
	if (type === 'error')
		console.error(line)
	else if (type === 'warning')
		console.warn(line)
	else if (type === 'info')
		console.info(line)
	else if (type === 'debug')
		console.debug(line)
	else
		console.log(line)
}

export const collectIssues = (page: Page) => {
	const issues: string[] = []
	page.on('console', (msg) => {
		const t = msg.type()
		const text = msg.text()
		const loc = msg.location()
		forwardBrowserConsoleLine(t, text, loc)
		if (text.includes('[vite] hot updated')) {
			issues.push(`dev-server-contamination: ${text}`)
			return
		}
		if (t !== 'error')
			return
		// Legacy ignore: hydrate paths historically surfaced resolver “requires query limit”; capped by the resolver context row-limit fallback now.
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
			:
				''
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

/**
	* Fail-fast gate for live network pages: `step()` races each await against first pageerror / critical console.error.
	* Matches filters in `network.e2e.ts` (ignore HTTP 4xx/5xx, resolver fetch noise, WSS drop copy).
	*/
export const setupNetworkLiveFailFast = (page: Page) => {
	let failed = false
	let rejectRuntimeError: ((error: Error) => void) | undefined
	const runtimeError = new Promise<never>((_, reject) => {
		rejectRuntimeError = reject
	})
	const failFast = (error: Error) => {
		if (failed) return
		failed = true
		rejectRuntimeError?.(error)
	}
	const step = async <_Value>(promise: Promise<_Value>) => {
		await Promise.race([
			promise,
			runtimeError,
		])
	}

	page.on('pageerror', (error) => {
		failFast(new Error(`pageerror: ${error.message}`))
	})

	page.on('crash', () => {
		failFast(new Error('Browser tab crashed'))
	})

	page.on('console', (message) => {
		if (
			message.type() === 'error'
			&& !message.text().includes('Failed to load resource: the server responded with a status of 400')
			&& !message.text().includes('Failed to load resource: the server responded with a status of 403')
			&& !message.text().includes('Failed to load resource: the server responded with a status of 404')
			&& !message.text().includes('Failed to load resource: the server responded with a status of 422')
			&& !message.text().includes('Failed to load resource: the server responded with a status of 429')
			&& !message.text().includes('Failed to load resource: the server responded with a status of 500')
			&& !message.text().includes('Failed to load resource: the server responded with a status of 502')
			&& !message.text().includes('Failed to load resource: the server responded with a status of 503')
			&& !message.text().includes('[vite] Failed to reload')
			&& !message.text().includes('Failed to fetch dynamically imported module')
			&& !message.text().includes('Failed to load resource: net::ERR_QUIC_PROTOCOL_ERROR')
			&& !message.text().includes('Failed to load resource: net::ERR_CONNECTION_REFUSED')
			&& !message.text().includes('Failed to load resource: net::ERR_FAILED')
			&& !message.text().includes('has been blocked by CORS policy')
			&& !message.text().includes('Voltaire: block stream ended')
			&& !(
				message.text().includes('[QueryCollection]')
				&& (
					/resolver\(s\) failed/.test(message.text())
					|| /Fetch failed \(\d{3}/.test(message.text())
				)
			)
		) failFast(new Error(`console error: ${message.text()}`))
		if (
			message.type() === 'warning'
			&& message.text().includes('Calling .preload() on a collection with syncMode "on-demand" is a no-op')
		) failFast(new Error(`console warning: ${message.text()}`))
	})

	return { step }
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
		if (!ipfsPublicGateways.some((gateway) => gateway.origin === u.origin))
			return false
		return u.pathname.includes('/ipfs/') || u.pathname.includes('/ipns/')
	} catch {
		return false
	}
}

/** Matches GETs to public Swarm HTTP gateways (`{origin}/bzz/…`). */
export const swarmPublicGatewayGetWire = (url: string) => {
	try {
		const u = new URL(url)
		if (!swarmGatewayUrls.some((origin) => origin === u.origin))
			return false
		return u.pathname.includes('/bzz/')
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
				typeof callbackOptions === 'function' ?
					callbackOptions
				:
					() => {}
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
	const fn = (req: {
		method: () => string
		url: () => string
	}) => {
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
	{
		chainId: 1,
		name: 'Ethereum Mainnet',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpc: [
			'https://ethereum.publicnode.com',
		],
	},
	{
		chainId: 8453,
		name: 'Base',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpc: [
			'https://mainnet.base.org',
		],
		parent: {
			type: 'L2',
			chain: 'eip155:1',
		},
	},
	{
		chainId: 42161,
		name: 'Arbitrum One',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpc: [
			'https://arb1.arbitrum.io/rpc',
		],
		parent: {
			type: 'L2',
			chain: 'eip155:1',
		},
	},
	{
		chainId: 10,
		name: 'Optimism',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18,
		},
		rpc: [
			'https://mainnet.optimism.io',
		],
		parent: {
			type: 'L2',
			chain: 'eip155:1',
		},
	},
	{
		chainId: 137,
		name: 'Polygon',
		nativeCurrency: {
			name: 'MATIC',
			symbol: 'MATIC',
			decimals: 18,
		},
		rpc: [
			'https://polygon-rpc.com',
		],
	},
	{
		chainId: 56,
		name: 'BNB Chain',
		nativeCurrency: {
			name: 'BNB',
			symbol: 'BNB',
			decimals: 18,
		},
		rpc: [
			'https://bsc-dataseed.binance.org',
		],
	},
])
export const MOCK_CHAINLIST_RPCS_CHAIN_COUNT = 6

/**
	* Minimal `chains.json` for ethereum-lists (same chain ids as {@link MOCK_CHAINLIST_RPCS_JSON_BODY}).
	* Includes L2 parent links so `/network/eip155:1` exercises the Chainlist / ethereum-lists child network subsets.
	*/
export const MOCK_ETHEREUM_LISTS_CHAINS_JSON_BODY = JSON.stringify(
	[
		{
			name: 'Ethereum Mainnet',
			chain: 'ETH',
			rpc: ['https://ethereum.publicnode.com'],
			nativeCurrency: {
				name: 'Ether',
				symbol: 'ETH',
				decimals: 18,
			},
			shortName: 'eth',
			chainId: 1,
			networkId: 1,
		},
		{
			name: 'Base',
			chain: 'ETH',
			rpc: ['https://mainnet.base.org'],
			nativeCurrency: {
				name: 'Ether',
				symbol: 'ETH',
				decimals: 18,
			},
			shortName: 'base',
			chainId: 8453,
			networkId: 8453,
			parent: {
				type: 'L2',
				chain: 'eip155:1',
			},
		},
		{
			name: 'Arbitrum One',
			chain: 'ETH',
			rpc: ['https://arb1.arbitrum.io/rpc'],
			nativeCurrency: {
				name: 'Ether',
				symbol: 'ETH',
				decimals: 18,
			},
			shortName: 'arb1',
			chainId: 42161,
			networkId: 42161,
			parent: {
				type: 'L2',
				chain: 'eip155:1',
			},
		},
		{
			name: 'Optimism',
			chain: 'ETH',
			rpc: ['https://mainnet.optimism.io'],
			nativeCurrency: {
				name: 'Ether',
				symbol: 'ETH',
				decimals: 18,
			},
			shortName: 'oeth',
			chainId: 10,
			networkId: 10,
			parent: {
				type: 'L2',
				chain: 'eip155:1',
			},
		},
		{
			name: 'Polygon',
			chain: 'MATIC',
			rpc: ['https://polygon-rpc.com'],
			nativeCurrency: {
				name: 'MATIC',
				symbol: 'MATIC',
				decimals: 18,
			},
			shortName: 'matic',
			chainId: 137,
			networkId: 137,
		},
		{
			name: 'BNB Chain',
			chain: 'BNB',
			rpc: ['https://bsc-dataseed.binance.org'],
			nativeCurrency: {
				name: 'BNB',
				symbol: 'BNB',
				decimals: 18,
			},
			shortName: 'bnb',
			chainId: 56,
			networkId: 56,
		},
	]
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

export const catalogWire = (url: string, method: string) => (
	method === 'GET'
	&& (
		chainlistRpcsWire(url)
		|| ethereumListsChainsJsonWire(url, method)
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

export const tradingViewCryptoScanWire = (url: string, method: string) => (
	method === 'POST'
	&& url.includes('/crypto/scan')
	&& (
		url.includes('scanner.tradingview.com')
		|| (url.includes('api-proxy') && url.includes('scanner.tradingview'))
	)
)

/**
	* Stubs Chainlist `rpcs.json`, ethereum-lists `chains.json`, L2Beat scaling summary, TradingView crypto scan, and public IPFS gateway GETs.
	* One-off real catalog runs: `E2E_USE_E2E_HTTP_STUBS=0 pnpm exec playwright test …` (OPFS / warm-reload tests may need the stub).
	*/
export const installChainlistRpcsJsonStub = async (page: Page) => {
	if (process.env.E2E_USE_E2E_HTTP_STUBS === '0')
		return
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
		if (method === 'GET' && swarmPublicGatewayGetWire(url)) {
			await route.fulfill({
				status: 200,
				contentType: 'text/html; charset=utf-8',
				body: '<!DOCTYPE html><html><head><title>Swarm e2e stub</title></head><body><p>e2e swarm gateway stub</p></body></html>',
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
	timeoutMs = 180_000
) => {
	await expect(page.locator('#main')).toBeAttached({ timeout: timeoutMs })
	const snapshot = await waitForBoundarySettle(page, { timeoutMs })
	expect(
		snapshot.failed.map((row) => `${row.key ?? 'unknown'}: ${row.message}`)
		).toEqual([])
	expect(
		snapshot.loading.map((row) => `${row.key ?? 'unknown'}: ${row.message}`)
		).toEqual([])
	expect(
		snapshot.empty ?
			`${snapshot.emptyReason ?? 'unknown'} (${snapshot.textLength} chars): ${(
				page.isClosed() ?
					'page closed'
				:
					await page.evaluate(() => ({
						finalUrl: location.href,
						readyState: document.readyState,
						mainCount: document.querySelectorAll('#main').length,
						bodyText: document.body.textContent.replace(/\s+/g, ' ').trim().slice(0, 500),
					})).then(jsonStringifyForExpectMessage)
			)}`
		:
			''
		).toBe('')
}

/**
	* Proves `resolveLive` started Voltaire’s subscription (layout mounted). WSS can still drop in CI/Playwright; use for smoke tests with stubbed chainlist.
	* Register the returned promise *before* `page.goto` so the first line is not missed.
	*/
export const voltaireBlockStreamWatchStartConsoleEvent = (page: Page, timeoutMs = 90_000) => (
	page.waitForEvent('console', {
		predicate: (msg) => {
			const t = msg.text()
			return (
				(t.includes('[Voltaire]') && t.includes('block stream watch start'))
				|| (t.includes('[block stream]') && t.includes('type=blocks'))
			)
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
	* HTTP JSON-RPC URL aligned with app `voltaireJsonRpcUrlWithTransportForChain`.
	* Playwright preflight uses `fetch` only, so WebSocket-only chains cannot use this probe.
	*/
export const publicJsonRpcHttpUrlForChainE2e = async (chainId: number) => {
	const t = voltaireJsonRpcUrlWithTransportForChain(chainId)
	if (t == null) return null
	if (t.transportType === TransportType.Http) return t.rpcUrl
	return null
}

/** In-browser public RPC check — matches client `fetch` + `corsEnabled: true` (not `/api-proxy`). Two `eth_blockNumber` samples; fail-fast when the chain is stuck or rate-limited (429). */
export const preflightChainHeadAdvances = async (
	page: Page,
	rpcUrl: string,
	gapMs: number
) => {
	const a = await preflightPublicJsonRpcEthBlockNumber(page, rpcUrl)
	if (!a.ok || a.blockNumberHex == null) return {
		ok: false as const,
		reason: 'first',
		detail: a,
	}
	const h0 = BigInt(a.blockNumberHex)
	await page.waitForTimeout(gapMs)
	const b = await preflightPublicJsonRpcEthBlockNumber(page, rpcUrl)
	if (!b.ok || b.blockNumberHex == null) return {
		ok: false as const,
		reason: 'second',
		detail: b,
	}
	const h1 = BigInt(b.blockNumberHex)
	if (h1 <= h0) return {
		ok: false as const,
		reason: 'stuck',
		h0,
		h1,
	}
	return {
		ok: true as const,
		h0,
		h1,
	}
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
	}: {
		attempts?: number
		betweenAttemptsMs?: number
	} = {}
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
	rpcUrl: string
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
						}
					),
				}
			)
			if (!res.ok) return {
				ok: false,
				status: res.status,
			}
			const j: {
				result?: string
				error?: {
					message?: string
				}
			} = await res.json()
			const hex = j.result
			if (typeof hex !== 'string' || !hex.startsWith('0x')) return {
				ok: false,
				status: res.status,
				error: j.error?.message,
			}
			return {
				ok: true,
				blockNumberHex: hex,
			}
		} catch (e) {
			return {
				ok: false,
				error: e instanceof Error ? e.message : String(e),
			}
		}
	}, rpcUrl)
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

/** Parses head block height from `#network-summary-head-block` only. */
export const readNetworkHeadBlockBigint = async (
	page: Page,
	linkWaitMs = 120_000
) => {
	const summaryLink = page.locator('#network-summary-head-block').locator('a[href*="/block/"]').first()
	await summaryLink.waitFor({
		state: 'attached',
		timeout: linkWaitMs,
	})
	return blockPathNumberFromHref(await summaryLink.getAttribute('href'))
}

const beaconPathNumberFromHref = (
	href: string | null,
	segment: 'epoch' | 'slot'
) => {
	if (href == null) return null
	const m = new RegExp(`/${segment}/([0-9]+)\\b`).exec(href)
	if (m == null) return null
	try {
		return BigInt(m[1])
	} catch {
		return null
	}
}

/** Head epoch from summary `<dl>` (`BeaconEpochView` link). */
export const readNetworkHeadEpochBigint = async (
	page: Page,
	linkWaitMs = 120_000
) => {
	const link = page
		.locator('.network-summary-head')
		.locator('a[href*="/epoch/"]')
		.first()
	await link.waitFor({
		state: 'attached',
		timeout: linkWaitMs,
	})
	return beaconPathNumberFromHref(await link.getAttribute('href'), 'epoch')
}

/** Head slot from summary `<dl>` (`BeaconSlotView` link). */
export const readNetworkHeadSlotBigint = async (
	page: Page,
	linkWaitMs = 120_000
) => {
	const link = page
		.locator('.network-summary-head')
		.locator('a[href*="/slot/"]')
		.first()
	await link.waitFor({
		state: 'attached',
		timeout: linkWaitMs,
	})
	return beaconPathNumberFromHref(await link.getAttribute('href'), 'slot')
}

/** Collapse the network `EntityView` card (summary `<dl>` stays mounted). */
export const collapseNetworkEntityView = async (page: Page) => {
	const networkCard = page.locator('article').filter({
		has: page.locator('#network-summary-head-block'),
	})
	const details = networkCard.locator('> details').first()
	await expect(details).toHaveAttribute('open', '')
	await details.locator('> summary').click()
	await expect(details).not.toHaveAttribute('open', '')
}

/** Scroll host (`layout-carousel`) — execution carousel pane host uses `network-carousel-execution`; panes are direct children (no `[data-carousel-panes]` wrapper). */
const networkExecutionCarouselPanesSel = '.network-carousel-execution[data-scroll-container~="layout-carousel"]'


export const readTopBlockNumberFromNetworkCarousel = async (
	page: Page,
	linkWaitMs = 90_000
) => {
	const first = page.locator(`${networkExecutionCarouselPanesSel} a[href*="/block/"]`).first()
	await first.waitFor({
		state: 'visible',
		timeout: linkWaitMs,
	})
	return blockPathNumberFromHref(await first.getAttribute('href'))
}

/** Top block link on `/network/:id/blocks` (`EvmBlocksView` inner list `article#…-items`). */
export const readTopBlockNumberFromNetworkBlocksPage = async (
	page: Page,
	linkWaitMs = 120_000
) => {
	const first = page.locator('#blocks-items a[href*="/block/"]').first()
	await first.waitFor({
		state: 'visible',
		timeout: linkWaitMs,
	})
	return blockPathNumberFromHref(await first.getAttribute('href'))
}

/** Block numbers from visible carousel links, in DOM order (per list implementation). */
export const readNetworkCarouselBlockNumbers = async (page: Page) => {
	const links = page.locator(`${networkExecutionCarouselPanesSel} a[href*="/block/"]`)
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
	const list = page.locator(`${networkExecutionCarouselPanesSel} a[href*="/tx/"]`)
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
		)
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

export const chunk = <T>(arr: T[], size: number): T[][] => (
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
	hrefs: string[]
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

/** Matches Chromium console copy for cross-origin fetches blocked in the browser (not proxied). */
export const browserCorsPolicyConsolePattern = /has been blocked by CORS policy/i

/** Append-only collector — register before `page.goto`. */
export const collectBrowserCorsPolicyViolations = (page: Page) => {
	const violations: string[] = []
	page.on('console', (message) => {
		const text = message.text()
		if (!browserCorsPolicyConsolePattern.test(text)) return
		const loc = message.location()
		const locStr = (
			loc.url ?
				` ${loc.url}:${loc.lineNumber}:${loc.columnNumber}`
			:
				''
		)
		violations.push(`${text}${locStr}`)
		forwardBrowserConsoleLine(message.type(), text, loc)
	})
	return violations
}
