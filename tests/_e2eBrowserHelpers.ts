import { expect, type Locator, type Page, type TestInfo } from '@playwright/test'

import { ipfsPublicGateways } from '$/constants/IpfsProtocol.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { gatewayUrls as swarmGatewayUrls } from '$/sources/Swarm/Rest/constants.ts'
import { voltaireJsonRpcTransportWithOriginsByChainId } from '$/sources/Voltaire/index.ts'
import type { JsonObject } from '$/typescript/JsonValue.ts'

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
		__blockheadClientProbeEnabled?: boolean
		__blockheadPersistenceTrace?: PersistenceTraceEvent[]
		__blockheadPersistedCollectionSchemaVersionOverride?: number
		__blockheadBoundaryProbe?: BoundaryUpdateEvent[]
		__blockheadBoundaryProbeActive?: BoundaryLoadingProbeRow[]
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
	id: string | null
	key: string | null
	message: string
}

export type BoundaryLoadingProbeRow = {
	id: string
	startedAt: number
	key: string | null
	message: string
}

export type BoundaryDomRow = {
	key: string | null
	state: 'failed' | 'loading'
	message: string
	context: string
}

export type BoundarySlowRow = {
	id: string | null
	key: string | null
	message: string
	durationMs: number
	resolved: boolean
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
	timings?: {
		navigationMs: number
		mainAttachedMs: number
		networkIdleMs: number
		settleMs: number
		eventsMs: number
		totalMs: number
	}
	updates: BoundaryUpdateEvent[]
	snapshot: BoundaryMainSnapshot
	diagnostics?: {
		console: {
			type: string
			text: string
		}[]
		pageErrors: {
			message: string
			stack?: string
		}[]
		badResponses: {
			status: number
			url: string
			method: string
			resourceType?: string
			frameUrl?: string
		}[]
		requestFailures: {
			url: string
			method: string
			failure: string | null
			resourceType?: string
			frameUrl?: string
		}[]
		lifecycle: {
			event: string
			at: number
		}[]
	}
	slow: BoundarySlowRow[]
	issues: string[]
}

export type PersistedCollectionSyncEvent = {
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

export type PersistedCollectionLoadEvent = {
	type: string
	collectionId: string
	key: string
	decision?: string
	status?: string
	rowCount?: number
	sourceRowCounts?: Partial<Record<string, number>>
	reason?: string
	error?: string
	trace?: JsonObject
}

export type PersistenceTraceEvent = {
	type: string
	collectionId: string
	mutationCount?: number
	rowMetadataMutationCount?: number
	collectionMetadataMutationCount?: number
	subsetRowCount?: number
	collectionMetadataCount?: number
	error?: string
}

export type BlockheadClientProbe = {
	events: {
		collectionSync: PersistedCollectionSyncEvent[]
		collectionLoads: PersistedCollectionLoadEvent[]
	}
	collectionSizes: () => {
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
}

export const networksCatalogFieldCollectionId = 'EntityFieldCollection:_Global:$$networks'

export const installPersistenceProbe = (page: Page) => (
	page.addInitScript(() => {
		window.__blockheadClientProbeEnabled = true
	})
)

export const clearPersistenceProbe = (page: Page) => (
	page.evaluate(() => {
		if (window.__blockheadClientProbe != null)
			window.__blockheadClientProbe.events.collectionLoads.length = 0
	})
)

export const getPersistenceProbeEvents = async (page: Page) => {
	let lastError: object | string | undefined
	for (let attempt = 0; attempt < 5; attempt += 1) {
		try {
			return await page.evaluate(() => (
				window.__blockheadClientProbe?.events.collectionLoads ?? []
			))
		} catch (error) {
			lastError = error instanceof Error ? error : String(error)
			await page.waitForLoadState('domcontentloaded', { timeout: 30_000 }).catch(() => {})
			await page.waitForTimeout(250)
		}
	}
	throw lastError
}

export const installBoundaryProbe = (page: Page) => (
	page.addInitScript(() => {
		const boundarySelector = '[data-error], [role="alert"], [data-tag].inline-placeholder, .loading, [aria-busy="true"]'
		let nextBoundaryProbeId = 0
		const boundaryProbeIdByElement = new WeakMap<Element, string>()
		const activeLoadingById = new Map<string, BoundaryLoadingProbeRow>()

		const boundaryProbeId = (element: Element) => {
			const existing = boundaryProbeIdByElement.get(element)
			if (existing != null) return existing
			const id = String(++nextBoundaryProbeId)
			boundaryProbeIdByElement.set(element, id)
			return id
		}

		const rowMessage = (element: Element) => {
			const ariaLabel = element.getAttribute('aria-label')?.trim()
			if (ariaLabel)
				return ariaLabel.slice(0, 500)
			return (
				element.textContent.replace(/\s+/g, ' ').trim().slice(0, 500)

			)
		}
		const rowContext = (element: Element) => {
			const pieces = []
			for (let parent = element.parentElement; parent != null && parent.id !== 'main'; parent = parent.parentElement) {
				const scrollMarkerLabel = parent.getAttribute('data-scroll-marker-label')
				if (scrollMarkerLabel)
					pieces.push(scrollMarkerLabel)

				const ariaLabel = parent.getAttribute('aria-label')
				if (ariaLabel)
					pieces.push(ariaLabel)

				const id = parent.getAttribute('id')
				if (id)
					pieces.push(`#${id}`)
			}
			return pieces.slice(0, 8).join(' > ')
		}

		const rowKey = (element: Element) => (
			element.getAttribute('data-error')
			?? element.getAttribute('aria-label')
		)

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
		window.__blockheadBoundaryProbeActive = []

		const syncActiveRows = () => {
			window.__blockheadBoundaryProbeActive = [...activeLoadingById.values()]
		}

		const pushBoundaryEvent = (
			kind: BoundaryUpdateEvent['kind'],
			id: string | null,
			key: string | null,
			message: string
		) => {
			(window.__blockheadBoundaryProbe ??= []).push({
				at: Date.now(),
				kind,
				id,
				key,
				message,
			})
		}

		const resolveLoading = (id: string, key: string | null, message: string) => {
			if (!activeLoadingById.has(id)) return
			activeLoadingById.delete(id)
			syncActiveRows()
			pushBoundaryEvent(
				'dom-resolved',
				id,
				key,
				message
			)
		}

		const syncBoundaryElement = (element: Element) => {
			const kind = domKindForElement(element)
			const id = boundaryProbeId(element)
			const key = rowKey(element)
			const message = rowMessage(element)

			if (kind === 'dom-loading') {
				if (!activeLoadingById.has(id)) {
					activeLoadingById.set(id, {
						id,
						startedAt: Date.now(),
						key,
						message,
					})
					syncActiveRows()
					pushBoundaryEvent(
						'dom-loading',
						id,
						key,
						message
					)
				}
				return
			}

			if (kind === 'dom-failed') {
				resolveLoading(id, key, message)
				pushBoundaryEvent(
					'dom-failed',
					id,
					key,
					message
				)
				return
			}

			resolveLoading(id, key, message)
		}

		const origConsoleError = console.error
		console.error = (...args: Parameters<typeof console.error>) => {
			const text = args.map((arg) => String(arg)).join(' ')
			if (text.includes('[blockhead:boundary:uncaught]')) {
				const keyMatch = text.match(/\[blockhead:boundary:uncaught\]\s+(\S+)/)
				pushBoundaryEvent(
					'console-uncaught',
					null,
					keyMatch?.[1] ?? null,
					text
				)
			}
			else if (text.includes('[blockhead:boundary]')) {
				const keyMatch = text.match(/\[blockhead:boundary\]\s+(\S+)/)
				pushBoundaryEvent(
					'console-failed',
					null,
					keyMatch?.[1] ?? null,
					text
				)
			}
			origConsoleError.apply(console, args)
		}

		const observeBoundaryNode = (node: Node) => {
			if (!(node instanceof Element)) return

			const candidates = (
				node.matches(boundarySelector) ?
					[node]
				:
					[...node.querySelectorAll(boundarySelector)]
			)

			for (const element of candidates)
				syncBoundaryElement(element)
		}

		const observeResolvedNode = (node: Node) => {
			if (!(node instanceof Element)) return

			const candidates = (
				node.matches(boundarySelector) ?
					[node]
				:
					[...node.querySelectorAll(boundarySelector)]
			)

			for (const element of candidates)
				resolveLoading(
					boundaryProbeId(element),
					rowKey(element),
					rowMessage(element)
				)
		}

		const attachMainObserver = (main: Element) => {
			const observer = new MutationObserver((records) => {
				for (const record of records) {
					if (
						record.type === 'attributes'
						&& record.target instanceof Element
					) syncBoundaryElement(record.target)

					for (const node of record.addedNodes)
						observeBoundaryNode(node)
					for (const node of record.removedNodes)
						observeResolvedNode(node)
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
		window.__blockheadBoundaryProbeActive = []
		}).catch(() => {})
)

export const clearBoundaryProbe = resetBoundaryProbe

export const getBoundaryProbeEvents = (page: Page) => (
	page.evaluate(() => (
		window.__blockheadBoundaryProbe ?? []
	))
)

const getBoundaryProbeEventCount = (page: Page) => (
	page.evaluate(() => (
		window.__blockheadBoundaryProbe?.length ?? 0
	))
)

export const getBoundaryProbeActive = (page: Page) => (
	page.evaluate(() => (
		window.__blockheadBoundaryProbeActive ?? []
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
		const rowContext = (element: Element) => {
			const pieces = []
			for (let parent = element.parentElement; parent != null && parent.id !== 'main'; parent = parent.parentElement) {
				const scrollMarkerLabel = parent.getAttribute('data-scroll-marker-label')
				if (scrollMarkerLabel)
					pieces.push(scrollMarkerLabel)

				const ariaLabel = parent.getAttribute('aria-label')
				if (ariaLabel)
					pieces.push(ariaLabel)

				const id = parent.getAttribute('id')
				if (id)
					pieces.push(`#${id}`)
			}
			return pieces.slice(0, 8).join(' > ')
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
			context: rowContext(element),
		}))

		const loading = [...main.querySelectorAll('.loading, [aria-busy="true"]')].map((element) => ({
			key: element.getAttribute('data-error'),
			state: 'loading' as const,
			message: rowMessage(element),
			context: rowContext(element),
		}))

		const contentMarkerCount = main.querySelectorAll(
			'section, dl, ul, ol, [data-card], h1, h2, h3, table, pre, canvas'
			).length
		const textLength = (
			failed.length === 0
			&& loading.length === 0
			&& contentMarkerCount === 0 ?
				main.textContent.replace(/\s+/g, ' ').trim().length
			:
				24
		)

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
		probeTimeoutMs = 20_000,
	}: {
		timeoutMs?: number
		quietMs?: number
		probeTimeoutMs?: number
	} = {}
) => {
	const deadline = Date.now() + timeoutMs
	let lastSignature = ''
	let quietSince = Date.now()
	const withProbeTimeout = async <
		const _Value,
	>(
		label: string,
		promise: Promise<_Value>
	) => (
		Promise.race([
			promise,
			new Promise<never>((_resolve, reject) => {
				setTimeout(() => {
					reject(new Error(`${label} timed out`))
				}, probeTimeoutMs)
			}),
		])
	)

	while (Date.now() < deadline) {
		let snapshot: BoundaryMainSnapshot
		try {
			snapshot = await withProbeTimeout('snapshotBoundaryMain', snapshotBoundaryMain(page))
		}
		catch {
			return {
				failed: [],
				loading: [],
				empty: true,
				emptyReason: page.isClosed() ? 'page-closed' : 'probe-evaluate-timeout',
				textLength: 0,
				contentMarkerCount: 0,
			}
		}
		const eventCount = await withProbeTimeout('getBoundaryProbeEventCount', getBoundaryProbeEventCount(page))
			.catch(() => -1)
		const signature = JSON.stringify({
			loading: snapshot.loading.length,
			failed: snapshot.failed.length,
			events: eventCount,
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

	return withProbeTimeout('snapshotBoundaryMain', snapshotBoundaryMain(page))
		.catch(() => ({
			failed: [],
			loading: [],
			empty: true,
			emptyReason: page.isClosed() ? 'page-closed' : 'probe-evaluate-timeout',
			textLength: 0,
			contentMarkerCount: 0,
		}))
}

export const summarizeRouteBoundaryReport = (
	pathname: string,
	finalUrl: string,
	mainVisible: boolean,
	updates: BoundaryUpdateEvent[],
	snapshot: BoundaryMainSnapshot,
	diagnostics?: RouteBoundaryReport['diagnostics'],
	timings?: RouteBoundaryReport['timings'],
	slowThresholdMs = 30_000
) => {
	const issues: string[] = []
	const loadingStartedAtById = new Map<string, BoundaryUpdateEvent>()
	const slow: BoundarySlowRow[] = []

	for (const event of updates) {
		if (event.kind === 'dom-loading' && event.id != null) {
			loadingStartedAtById.set(event.id, event)
			continue
		}

		if (event.id == null) continue

		const loading = loadingStartedAtById.get(event.id)
		if (loading == null) continue

		const durationMs = event.at - loading.at
		if (durationMs >= slowThresholdMs) {
			slow.push({
				id: event.id,
				key: loading.key,
				message: loading.message,
				durationMs,
				resolved: true,
			})
		}
		loadingStartedAtById.delete(event.id)
	}

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

	for (const row of slow) {
		issues.push(
			`slow-loading:${row.key ?? 'unknown'}:${row.durationMs}ms:${row.message || '(no message)'}`
		)
	}

	if (snapshot.empty)
		issues.push(`empty:${snapshot.emptyReason ?? 'unknown'}`)

	if ((timings?.totalMs ?? 0) >= slowThresholdMs)
		issues.push(`slow-route:${timings?.totalMs}ms`)

	for (const entry of diagnostics?.pageErrors ?? [])
		issues.push(`page-error:${entry.message}`)

	for (const entry of diagnostics?.badResponses ?? [])
		issues.push(`bad-response:${entry.status}:${entry.method}:${entry.url}`)

	for (const entry of diagnostics?.requestFailures ?? [])
		issues.push(`request-failed:${entry.method}:${entry.url}:${entry.failure ?? 'unknown'}`)

	for (const entry of diagnostics?.lifecycle ?? [])
		issues.push(`page-${entry.event}`)

	for (const entry of diagnostics?.console ?? []) {
		if (entry.type === 'error')
			issues.push(`console-error:${entry.text}`)
	}

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
		timings,
		updates,
		snapshot,
		diagnostics,
		slow,
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
	const diagnosticRoutes = reports.filter((report) => (
		(report.diagnostics?.pageErrors.length ?? 0) > 0
		|| (report.diagnostics?.badResponses.length ?? 0) > 0
		|| (report.diagnostics?.requestFailures.length ?? 0) > 0
		|| (report.diagnostics?.lifecycle.length ?? 0) > 0
		|| (report.diagnostics?.console.some((entry) => entry.type === 'error') ?? false)
	))
	const loadingRoutes = reports.filter((report) => report.snapshot.loading.length > 0)
	const slowRoutes = reports.filter((report) => report.slow.length > 0)
	const slowRouteTimingRoutes = reports.filter((report) => (
		report.timings != null
		&& report.issues.some((issue) => issue.startsWith('slow-route:'))
	))
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
		`slow loading ${slowRoutes.length}`,
		`slow routes ${slowRouteTimingRoutes.length}`,
		`empty ${emptyRoutes.length}`,
		`diagnostics ${diagnosticRoutes.length}`,
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

	if (slowRoutes.length > 0) {
		lines.push('Slow loading boundaries:')
		for (const report of slowRoutes) {
			const tag = optionalPathnames.has(report.pathname) ? ' (optional-live)' : ''
			lines.push(`  ${report.pathname}${tag}`)
			for (const row of report.slow)
				lines.push(`    ${row.key ?? 'unknown'}: ${row.durationMs}ms: ${row.message}`)
		}
		lines.push('')
	}

	if (slowRouteTimingRoutes.length > 0) {
		lines.push('Slow route timings:')
		for (const report of slowRouteTimingRoutes) {
			const tag = optionalPathnames.has(report.pathname) ? ' (optional-live)' : ''
			const timings = report.timings
			if (timings == null) continue

			lines.push(`  ${report.pathname}${tag}`)
			lines.push(`    total ${timings.totalMs}ms`)
			lines.push(`    navigation ${timings.navigationMs}ms`)
			lines.push(`    main attached ${timings.mainAttachedMs}ms`)
			lines.push(`    network idle ${timings.networkIdleMs}ms`)
			lines.push(`    settle ${timings.settleMs}ms`)
			lines.push(`    events ${timings.eventsMs}ms`)
			for (const event of report.updates.slice(-12))
				lines.push(`    [${event.kind}] ${event.at}: ${event.key ?? 'unknown'}: ${event.message}`)
		}
		lines.push('')
	}

	if (emptyRoutes.length > 0) {
		lines.push('Empty main after settle:')
		for (const report of emptyRoutes)
			lines.push(`  ${report.pathname} (${report.snapshot.emptyReason ?? 'unknown'})`)
		lines.push('')
	}

	if (diagnosticRoutes.length > 0) {
		lines.push('Page diagnostics:')
		for (const report of diagnosticRoutes) {
			const tag = optionalPathnames.has(report.pathname) ? ' (optional-live)' : ''
			lines.push(`  ${report.pathname}${tag}`)
			for (const entry of report.diagnostics?.pageErrors ?? [])
				lines.push(`    [page-error] ${entry.message}`)
			for (const entry of report.diagnostics?.badResponses ?? [])
				lines.push(`    [bad-response] ${entry.status} ${entry.method} ${entry.url}${entry.resourceType ? ` (${entry.resourceType})` : ''}${entry.frameUrl ? ` from ${entry.frameUrl}` : ''}`)
			for (const entry of report.diagnostics?.requestFailures ?? [])
				lines.push(`    [request-failed] ${entry.method} ${entry.url}${entry.resourceType ? ` (${entry.resourceType})` : ''}${entry.frameUrl ? ` from ${entry.frameUrl}` : ''}: ${entry.failure ?? 'unknown'}`)
			for (const entry of report.diagnostics?.lifecycle ?? [])
				lines.push(`    [page-${entry.event}] ${entry.at}`)
			for (const entry of report.diagnostics?.console.filter((consoleEntry) => consoleEntry.type === 'error') ?? [])
				lines.push(`    [console-error] ${entry.text}`)
		}
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

const browserResourceFailureIsUpstreamNoise = (text: string) => (
	text.startsWith('Failed to load resource')
	&& (
		/\b[45]\d\d\b/.test(text)
		|| text.includes('ERR_NAME_NOT_RESOLVED')
		|| text.includes('net::ERR_')
	)
)

const browserConsoleErrorIsIgnored = (
	text: string,
	{
		ignoreTransientDevLoad,
	}: {
		ignoreTransientDevLoad?: boolean
	} = {}
) => (
	browserResourceFailureIsUpstreamNoise(text)
	|| (
		ignoreTransientDevLoad === true
		&& (
			text.includes('[vite] Failed to reload')
			|| text.includes('Failed to fetch dynamically imported module')
		)
	)
	// Legacy ignore: hydrate paths historically surfaced resolver “requires query limit”; capped by the resolver context row-limit fallback now.
	|| (
		text.includes('[QueryCollection]')
		&& text.includes('requires query limit')
	)
)

export const browserDevServerContaminationError = (text: string) => (
	text.includes('[vite] hot updated') ?
		new Error(`route smoke test contaminated by Vite HMR during navigation: ${text}`)
	:
		undefined
)

export type PageRuntimeDiagnostics = {
	issues: string[]
	lines: string[]
	step: <_Value>(promise: Promise<_Value>) => Promise<_Value>
	summary: () => string
	flushArtifacts: (testInfo: TestInfo) => Promise<void>
}

export const setupPageRuntimeDiagnostics = (
	page: Page,
	{
		failFast = true,
		forwardConsole = false,
		failOnDevServerContamination = false,
		failOnTanStackWarnings = false,
		ignoreTransientDevLoad = false,
	}: {
		failFast?: boolean
		forwardConsole?: boolean
		failOnDevServerContamination?: boolean
		failOnTanStackWarnings?: boolean
		ignoreTransientDevLoad?: boolean
	} = {}
): PageRuntimeDiagnostics => {
	const issues: string[] = []
	const lines: string[] = []
	let failed = false
	let rejectRuntimeError: ((error: Error) => void) | undefined
	const runtimeError = new Promise<never>((_, reject) => {
		rejectRuntimeError = reject
	})
	void runtimeError.catch(() => {})
	const failFastEnabled = failFast
	const triggerFailFast = (error: Error) => {
		if (!failFastEnabled || failed) return
		failed = true
		rejectRuntimeError?.(error)
	}
	const pushIssue = (issue: string) => {
		issues.push(issue)
		triggerFailFast(new Error(issue))
	}

	page.on('console', (message) => {
		const text = message.text()
		const location = message.location()
		const locationText = (
			location.url ?
				` ${location.url}:${location.lineNumber}:${location.columnNumber}`
			:
				''
		)
		lines.push(`${message.type()}${locationText} ${text}`)
		if (forwardConsole)
			forwardBrowserConsoleLine(message.type(), text, location)

		const contamination = browserDevServerContaminationError(text)
		if (contamination != null) {
			const issue = `dev-server-contamination: ${text}`
			issues.push(issue)
			if (failOnDevServerContamination)
				triggerFailFast(contamination)
			return
		}

		if (
			failOnTanStackWarnings
			&& text.includes('[TanStack DB]')
			&& text.includes('requires an index')
		) {
			pushIssue(`tanstack db query warning: ${text}`)
			return
		}

		if (
			message.type() === 'error'
			&& !browserConsoleErrorIsIgnored(text, { ignoreTransientDevLoad })
		)
			pushIssue(`console.error:${locationText} ${text}`)
	})
	page.on('pageerror', (error) => {
		const issue = `pageerror: ${error.message}`
		lines.push(issue)
		if (error.stack)
			lines.push(error.stack)
		pushIssue(issue)
	})
	page.on('crash', () => {
		const issue = 'Browser tab crashed'
		lines.push(issue)
		pushIssue(issue)
	})

	return {
		issues,
		lines,
		step: async (promise) => (
			await Promise.race([
				promise,
				runtimeError,
			])
		),
		summary: () => [
			...issues.slice(-20),
			...(
				issues.length === 0 ?
					lines.slice(-20)
				:
					[]
			),
		].join('\n'),
		flushArtifacts: async (testInfo) => {
			await testInfo.attach('browser-console-tail.txt', {
				body: lines.slice(-250).join('\n'),
				contentType: 'text/plain',
			})
			let html = ''
			try {
				html = await page.content()
			}
			catch (contentError) {
				html = `page.content failed: ${contentError}`
				try {
					html += (
						`\n---\nouterHTML (evaluate):\n${await page.evaluate(() => (
							document.documentElement.outerHTML
						))}`
					)
				}
				catch (evaluateError) {
					html += `\n---\nevaluate failed: ${evaluateError}\npage.isClosed()=${page.isClosed()}`
				}
			}
			await testInfo.attach('page-snippet.html', {
				body: html.slice(0, 80_000),
				contentType: 'text/html',
			})
			let screenshotFilename = 'failure-screenshot.png'
			let screenshotContentType: 'image/png' | 'text/plain' = 'image/png'
			const screenshotBody = await page.screenshot({
				fullPage: true,
			}).catch((screenshotError) => {
				screenshotFilename = 'failure-screenshot-error.txt'
				screenshotContentType = 'text/plain'
				return Buffer.from(`screenshot failed: ${screenshotError}`, 'utf8')
			})
			await testInfo.attach(screenshotFilename, {
				body: screenshotBody,
				contentType: screenshotContentType,
			})
			const domHints = await page.evaluate(() => ({
				bodyChildren: document.body.childElementCount,
				hasLayout: !!document.querySelector('#layout'),
				hasMain: !!document.querySelector('#main'),
				readyState: document.readyState,
			})).catch((error) => ({
				bodyChildren: null,
				hasLayout: false,
				hasMain: false,
				readyState: `(evaluate failed: ${error})`,
			}))
			await testInfo.attach('failure-meta.txt', {
				body: (
					`url=${page.url()}\n`
					+ `viewport=${JSON.stringify(page.viewportSize())}\n`
					+ `dom=${JSON.stringify(domHints)}\n`
				),
				contentType: 'text/plain',
			})
		},
	}
}

export const collectIssues = (page: Page) => (
	setupPageRuntimeDiagnostics(page, {
		failFast: false,
		forwardConsole: true,
		failOnDevServerContamination: false,
	}).issues
)

export const pageFailureSnapshot = async (page: Page) => (
	page.isClosed() ?
		'page closed'
	:
		await page.evaluate(() => ({
			finalUrl: location.href,
			readyState: document.readyState,
			mainCount: document.querySelectorAll('#main').length,
			bodyText: document.body.textContent.replace(/\s+/g, ' ').trim().slice(0, 800),
		})).then(jsonStringifyForExpectMessage).catch((error) => (
			`page snapshot failed: ${error}`
		))
)

export const expectMainVisible = async (
	page: Page,
	timeoutMs = 120_000,
	diagnostics?: PageRuntimeDiagnostics
) => {
	try {
		await (
			diagnostics ?
				diagnostics.step(expect(page.locator('#main')).toBeVisible({ timeout: timeoutMs }))
			:
				expect(page.locator('#main')).toBeVisible({ timeout: timeoutMs })
		)
	}
	catch (error) {
		throw new Error(
			[
				`#main did not become visible within ${timeoutMs}ms`,
				`url=${page.url()}`,
				`runtime issues:\n${diagnostics?.summary() || '(no diagnostics installed or no browser runtime issues captured)'}`,
				`page snapshot:\n${await pageFailureSnapshot(page)}`,
			].join('\n\n'),
			{ cause: error }
		)
	}
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

export const MOCK_COINGECKO_ASSET_PLATFORMS_BODY = JSON.stringify([
	{
		id: 'ethereum',
		name: 'Ethereum',
		chain_identifier: 1,
		native_coin_id: 'ethereum',
	},
	{
		id: 'optimistic-ethereum',
		name: 'Optimism',
		chain_identifier: 10,
		native_coin_id: 'ethereum',
	},
	{
		id: 'arbitrum-one',
		name: 'Arbitrum One',
		chain_identifier: 42161,
		native_coin_id: 'ethereum',
	},
	{
		id: 'base',
		name: 'Base',
		chain_identifier: 8453,
		native_coin_id: 'ethereum',
	},
	{
		id: 'polygon-pos',
		name: 'Polygon POS',
		chain_identifier: 137,
		native_coin_id: 'matic-network',
	},
	{
		id: 'binance-smart-chain',
		name: 'BNB Smart Chain',
		chain_identifier: 56,
		native_coin_id: 'binancecoin',
	},
])

export const coingeckoAssetPlatformsWire = (url: string, method: string) => (
	method === 'GET'
	&& url.includes('/asset_platforms')
	&& (
		url.includes('api.coingecko.com')
		|| (url.includes('api-proxy') && url.includes('api.coingecko.com'))
	)
)

export const MOCK_COINGECKO_ETHEREUM_COIN_BODY = JSON.stringify({
	id: 'ethereum',
	symbol: 'eth',
	name: 'Ethereum',
	asset_platform_id: null,
	platforms: {},
	detail_platforms: {
		ethereum: {
			decimal_place: 18,
		},
	},
	market_data: {
		current_price: {
			usd: 3000,
		},
		market_cap: {
			usd: 360000000000,
		},
		market_cap_rank: 2,
		total_volume: {
			usd: 12000000000,
		},
		last_updated: '2026-01-01T00:00:00.000Z',
	},
})

export const coingeckoEthereumCoinWire = (url: string, method: string) => (
	method === 'GET'
	&& url.includes('/coins/ethereum')
	&& (
		url.includes('api.coingecko.com')
		|| (url.includes('api-proxy') && url.includes('api.coingecko.com'))
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

export const openchainSignatureWire = (url: string, method: string) => (
	method === 'GET'
	&& url.includes('/signature-database/v1/lookup')
	&& (
		url.includes('api.4byte.sourcify.dev')
		|| (url.includes('api-proxy') && url.includes('api.4byte.sourcify.dev'))
	)
)

export const openchainDirectoryWire = (url: string, method: string) => (
	method === 'GET'
	&& (
		url.includes('/api/v1/signatures/')
		|| url.includes('/api/v1/event-signatures/')
	)
	&& (
		url.includes('www.4byte.directory')
		|| (url.includes('api-proxy') && url.includes('www.4byte.directory'))
	)
)

export const openchainSignatureBody = (url: string) => {
	const decodedUrl = decodeURIComponent(url)
	return JSON.stringify({
		ok: true,
		result: {
			function: {
				'0xa9059cbb': [
					{ name: 'transfer(address,uint256)' },
				],
			},
			event: {
				'0x000000000000000000000000000000000000000000000000000000000a9059cbb': [
					{ name: 'Transfer(address,address,uint256)' },
				],
			},
			error: decodedUrl.includes('function=') ?
				{
					'0xa9059cbb': [
						{ name: 'TransferFailed(address,uint256)' },
					],
				}
			:
				{},
		},
	})
}

export const MOCK_OPENCHAIN_DIRECTORY_BODY = JSON.stringify({
	results: [
		{
			text_signature: 'Transfer(address,address,uint256)',
		},
	],
})

export const MOCK_FARCASTER_ALL_CHANNELS_BODY = JSON.stringify({
	result: {
		channels: [
			{
				id: 'ethereum',
				name: 'Ethereum',
				url: 'https://warpcast.com/~/channel/ethereum',
				description: 'E2E Ethereum channel',
			},
			{
				id: 'developers',
				name: 'Developers',
				url: 'https://warpcast.com/~/channel/developers',
				description: 'E2E Developers channel',
			},
		],
	},
	next: {},
})

export const MOCK_FARCASTER_CHANNEL_BODY = JSON.stringify({
	result: {
		channel: {
			id: 'ethereum',
			name: 'Ethereum',
			url: 'https://warpcast.com/~/channel/ethereum',
			description: 'E2E Ethereum channel',
		},
	},
})

export const MOCK_FARCASTER_USER_THREAD_CASTS_BODY = JSON.stringify({
	result: {
		casts: [
			{
				hash: '0xe4f2e1c70d72388a98dba2a2511a9b480840e544',
				threadHash: '0xe4f2e1c70d72388a98dba2a2511a9b480840e544',
				author: {
					fid: 3,
					username: 'dwr',
				},
				text: 'E2E Farcaster cast',
				timestamp: 1_700_000_000,
				replies: {
					count: 0,
				},
				reactions: {
					count: 0,
				},
				recasts: {
					count: 0,
				},
				quoteCount: 0,
			},
		],
	},
})

export const MOCK_FARCASTER_CHANNEL_FOLLOWERS_BODY = JSON.stringify({
	result: {
		users: [
			{
				fid: 3,
				followedAt: 1_700_000_000,
			},
		],
	},
	next: {},
})

export const MOCK_FARCASTER_CHANNEL_MEMBERS_BODY = JSON.stringify({
	result: {
		members: [
			{
				fid: 3,
				memberAt: 1_700_000_000,
			},
		],
	},
	next: {},
})

export const MOCK_FARCASTER_USER_FOLLOWING_CHANNELS_BODY = JSON.stringify({
	result: {
		channels: [
			{
				id: 'memes',
				name: 'Memes',
				url: 'https://warpcast.com/~/channel/memes',
				description: 'E2E Memes channel',
			},
		],
	},
	next: {},
})

export const farcasterRestWire = (url: string, method: string) => (
	method === 'GET'
	&& (
		url.includes('api.farcaster.xyz')
		|| url.includes('farcaster.xyz')
		|| (url.includes('api-proxy') && url.includes('farcaster'))
	)
)

export const snapchainRestWire = (url: string, method: string) => (
	method === 'GET'
	&& (
		url.includes('hub.pinata.cloud/v1/')
		|| url.includes('snap.farcaster.xyz')
		|| url.includes('pop.farcaster.xyz')
		|| url.includes('haatz.quilibrium.com')
		|| (url.includes('api-proxy') && (
			url.includes('hub.pinata.cloud')
			|| url.includes('snap.farcaster.xyz')
			|| url.includes('pop.farcaster.xyz')
			|| url.includes('haatz.quilibrium.com')
		))
	)
)

const snapchainPageBody = JSON.stringify({ messages: [] })
const snapchainFidsBody = JSON.stringify({ fids: [3, 2] })
const snapchainUsernameProofsBody = JSON.stringify({
	proofs: [
		{ name: 'e2e' },
	],
})
const snapchainCast = {
	hash: '0xe4f2e1c70d72388a98dba2a2511a9b480840e544',
	data: {
		fid: 3,
		timestamp: 1_700_000_000,
		castAddBody: {
			text: 'E2E Snapchain cast',
			mentions: [],
			embeds: [],
		},
	},
}
const snapchainCastBody = JSON.stringify(snapchainCast)
const snapchainCastPageBody = JSON.stringify({
	messages: [
		snapchainCast,
	],
})

/**
	* Stubs Chainlist `rpcs.json`, ethereum-lists `chains.json`, Coingecko asset platforms, L2Beat scaling summary, TradingView crypto scan, Openchain signature lookups, Farcaster/Snapchain public reads, and public IPFS gateway GETs.
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
		if (coingeckoAssetPlatformsWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: MOCK_COINGECKO_ASSET_PLATFORMS_BODY,
			})
			return
		}
		if (coingeckoEthereumCoinWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: MOCK_COINGECKO_ETHEREUM_COIN_BODY,
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
		if (openchainSignatureWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: openchainSignatureBody(url),
			})
			return
		}
		if (openchainDirectoryWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: MOCK_OPENCHAIN_DIRECTORY_BODY,
			})
			return
		}
		if (farcasterRestWire(url, method)) {
			const decodedUrl = decodeURIComponent(url)
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: (
					decodedUrl.includes('/~api/v2/user-thread-casts') ?
						MOCK_FARCASTER_USER_THREAD_CASTS_BODY
					:
					decodedUrl.includes('/v1/channel-followers') ?
						MOCK_FARCASTER_CHANNEL_FOLLOWERS_BODY
					:
					decodedUrl.includes('/v1/channel-members') ?
						MOCK_FARCASTER_CHANNEL_MEMBERS_BODY
					:
					decodedUrl.includes('/v1/user-following-channels') ?
						MOCK_FARCASTER_USER_FOLLOWING_CHANNELS_BODY
					:
						decodedUrl.includes('/v2/all-channels') ?
						MOCK_FARCASTER_ALL_CHANNELS_BODY
					:
						decodedUrl.includes('/v1/channel') ?
							MOCK_FARCASTER_CHANNEL_BODY
						:
							decodedUrl.includes('/fc/primary-address') ?
								JSON.stringify({ result: { address: {} } })
							:
								JSON.stringify({ result: {} })
				),
			})
			return
		}
		if (snapchainRestWire(url, method)) {
			const decodedUrl = decodeURIComponent(url)
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: (
					decodedUrl.includes('/v1/castById') ?
						snapchainCastBody
					:
						(
							decodedUrl.includes('/v1/castsByFid')
							|| decodedUrl.includes('/v1/castsByParent')
						) ?
							snapchainCastPageBody
					:
					decodedUrl.includes('/v1/fids') ?
						snapchainFidsBody
					:
						decodedUrl.includes('/v1/userNameProofsByFid') ?
							snapchainUsernameProofsBody
						:
							decodedUrl.includes('/v1/onChainEventsByFid') ?
								JSON.stringify({ events: [] })
							:
								snapchainPageBody
				),
			})
			return
		}
		await route.continue()
	})
}

export const assertMainSettled = async (
	page: Page,
	timeoutMs = 180_000,
	diagnostics?: PageRuntimeDiagnostics
) => {
	await expectMainVisible(page, timeoutMs, diagnostics)
	const snapshot = await waitForBoundarySettle(page, { timeoutMs })
	expect(
		snapshot.failed.map((row) => `${row.key ?? 'unknown'}: ${row.message}${row.context ? ` (${row.context})` : ''}`)
		).toEqual([])
	expect(
		snapshot.loading.map((row) => `${row.key ?? 'unknown'}: ${row.message}${row.context ? ` (${row.context})` : ''}`)
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
	* HTTP JSON-RPC URL aligned with app `voltaireJsonRpcTransportWithOriginsByChainId`.
	* Playwright preflight uses `fetch` only, so WebSocket-only chains cannot use this probe.
	*/
export const publicJsonRpcHttpUrlForChainE2e = async (chainId: number) => {
	const t = Object.entries(voltaireJsonRpcTransportWithOriginsByChainId)
		.find(([candidateChainId]) => Number(candidateChainId) === chainId)?.[1]
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
