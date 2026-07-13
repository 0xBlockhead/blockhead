import { expect, type Locator, type Page, type TestInfo } from '@playwright/test'
import { parse } from 'devalue'

import { ipfsPublicGateways } from '$/constants/IpfsProtocol.ts'
import { mastodonInstanceByKey } from '$/constants/Mastodon.ts'
import {
	nostrNetworkSeedNotes,
	nostrNetworkSeedProfiles,
	nostrNetworkSeedRelays,
} from '$/constants/Social/Nostr.ts'
import {
	redditNetworkSeedComments,
	redditNetworkSeedLinks,
	redditNetworkSeedSubreddits,
} from '$/constants/Social/Reddit.ts'
import { rssNetworkSeedFeeds } from '$/constants/Social/Rss.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { gatewayUrls as swarmGatewayUrls } from '$/sources/Swarm/Rest/constants.ts'
import { voltaireJsonRpcTransportWithOriginsByChainId } from '$/sources/Voltaire/index.ts'
import type { JsonValue } from '$/typescript/JsonValue.ts'
import type {
	ClientProbe as BlockheadClientProbe,
	PersistenceTraceEvent,
} from '$/client/$e2eProbe.ts'

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

/** Structural smells scanned in HTML (source / markup), not only visible text. */
export const generatedRouteHtmlArtifactPatterns = [
	/\bEntityType\.Unknown\b/,
	/<title>\{'Entity'\}<\/title>/,
	/\bNo rows\b/,
	/\/venues\b/,
] as const

/**
 * Machine-payload / dump smells scanned in visible title + `#main` text only.
 * Attribute-only devalue (`id` / `view-transition-name` via `stringify`) is intentional and excluded.
 */
export const generatedRouteVisibleArtifactPatterns = [
	/\bdevalue\b/i,
	/EntityView-\{/,
	/\[object Object\]/,
	/\{\s*("|&quot;)?(entityType|selector|fields|values)("|&quot;)?\s*:/,
	/\[\s*\{\s*"[^"]+"\s*:\s*\d+\s*\}/,
] as const

export const generatedRouteArtifactPatterns = [
	...generatedRouteHtmlArtifactPatterns,
	...generatedRouteVisibleArtifactPatterns,
] as const

export const snapshotGeneratedRouteArtifacts = async (page: Page) => (
	page.evaluate(() => {
		const main = document.querySelector('#main')
		return {
			html: document.documentElement.outerHTML.slice(0, 50_000),
			title: document.title,
			bodyText: document.body.textContent.replace(/\s+/g, ' ').trim().slice(0, 2_000),
			mainText: (main?.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 4_000),
			entityViewCount: document.querySelectorAll('.entity-view-summary, [class*="entity-view"]').length,
			plainLinkListCount: document.querySelectorAll('#main ul:not(:has(.entity-view-summary)) > li > a:only-child').length,
			notFoundCount: document.querySelectorAll('#main [id$="not-found"]').length,
			errorCount: document.querySelectorAll('#main [data-error]').length,
			mainEmpty: main != null && main.textContent.replace(/\s+/g, '').length === 0,
		}
	})
)

export const assertNoGeneratedRouteArtifacts = async (
	page: Page,
	pathname: string
) => {
	const snapshot = await snapshotGeneratedRouteArtifacts(page)
	const htmlHits = generatedRouteHtmlArtifactPatterns.filter((pattern) => (
		pattern.test(snapshot.html)
		|| pattern.test(snapshot.title)
	))
	const visibleHits = generatedRouteVisibleArtifactPatterns.filter((pattern) => (
		pattern.test(snapshot.title)
		|| pattern.test(snapshot.mainText)
		|| pattern.test(snapshot.bodyText)
	))
	const emptyShellHits = snapshot.mainEmpty ? ['#main empty shell'] : []

	expect(
		[
			...htmlHits.map((pattern) => pattern.toString()),
			...visibleHits.map((pattern) => pattern.toString()),
			...emptyShellHits,
		],
		`${pathname} generated-route artifact markers in DOM/title`
	).toEqual([])
}

export const assertCanonicalRouteUrl = async (
	page: Page,
	pathname: string
) => {
	const url = new URL(page.url())
	await expect(url.pathname, `${pathname} canonical route pathname`).toBe(pathname)
	await expect(url.search, `${pathname} canonical route query`).toBe('')
	await expect(url.hash, `${pathname} canonical route fragment`).toBe('')
}

declare global {
	interface Window {
		__e2eViewTransitionStarts?: number
		__e2eViewTransitionFinishes?: number
		__e2eViewTransitionUpdates?: number
		__blockheadClientProbe?: BlockheadClientProbe
		__blockheadClientProbeEnabled?: boolean
		__blockheadPersistenceTrace?: PersistenceTraceEvent[]
		__blockheadPersistedCollectionSchemaVersionOverride?: number
		__blockheadWaSqliteDatabaseNameOverride?: string
		__blockheadWaSqliteVfsNameOverride?: string
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
	context: string
}

export type BoundaryLoadingProbeRow = {
	id: string
	startedAt: number
	key: string | null
	message: string
	context: string
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
	context: string
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
			const detailTerm = element.closest('dd')?.previousElementSibling
			if (detailTerm?.matches('dt'))
				pieces.push(`field=${detailTerm.textContent.replace(/\s+/g, ' ').trim().slice(0, 120)}`)

			for (let parent = element.parentElement; parent != null && parent.id !== 'main'; parent = parent.parentElement) {
				const entityType = parent.getAttribute('data-entity-field-type')
				const fieldName = parent.getAttribute('data-entity-field-name')
				if (entityType || fieldName)
					pieces.push(`resource=${entityType || '?entity'}.${fieldName || '?field'}`)

				const scrollMarkerLabel = parent.getAttribute('data-scroll-marker-label')
				if (scrollMarkerLabel)
					pieces.push(`section=${scrollMarkerLabel}`)

				const ariaLabel = parent.getAttribute('aria-label')
				if (ariaLabel)
					pieces.push(ariaLabel)

				const id = parent.getAttribute('id')
				if (id)
					pieces.push(`id=#${id}`)
			}

			const heading = element
				.closest('section, article, details, [data-scroll-marker-label], [data-card]')
				?.querySelector('h1, h2, h3, h4, h5, h6, summary')
				?.textContent.replace(/\s+/g, ' ').trim().slice(0, 120)
			if (heading)
				pieces.push(`heading=${heading}`)

			if (pieces.length === 0) {
				for (let parent = element.parentElement; parent != null && parent.id !== 'main'; parent = parent.parentElement)
					pieces.push(`${parent.tagName.toLowerCase()}${parent.id ? `#${parent.id}` : ''}`)
			}

			return [...new Set(pieces)].slice(0, 8).join(' > ')
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
			message: string,
			context: string
		) => {
			(window.__blockheadBoundaryProbe ??= []).push({
				at: Date.now(),
				kind,
				id,
				key,
				message,
				context,
			})
		}

		const resolveLoading = (
			id: string,
			key: string | null,
			message: string,
			context: string
		) => {
			if (!activeLoadingById.has(id)) return
			activeLoadingById.delete(id)
			syncActiveRows()
			pushBoundaryEvent(
				'dom-resolved',
				id,
				key,
				message,
				context
			)
		}

		const syncBoundaryElement = (element: Element) => {
			const kind = domKindForElement(element)
			const id = boundaryProbeId(element)
			const key = rowKey(element)
			const message = rowMessage(element)
			const context = rowContext(element)

			if (kind === 'dom-loading') {
				if (!activeLoadingById.has(id)) {
					activeLoadingById.set(id, {
						id,
						startedAt: Date.now(),
						key,
						message,
						context,
					})
					syncActiveRows()
					pushBoundaryEvent(
						'dom-loading',
						id,
						key,
						message,
						context
					)
				}
				return
			}

			if (kind === 'dom-failed') {
				resolveLoading(id, key, message, context)
				pushBoundaryEvent(
					'dom-failed',
					id,
					key,
					message,
					context
				)
				return
			}

			resolveLoading(id, key, message, context)
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
					text,
					[...activeLoadingById.values()].slice(-8).map((row) => row.context).filter(Boolean).join(' || ')
				)
			}
			else if (text.includes('[blockhead:boundary]')) {
				const keyMatch = text.match(/\[blockhead:boundary\]\s+(\S+)/)
				pushBoundaryEvent(
					'console-failed',
					null,
					keyMatch?.[1] ?? null,
					text,
					[...activeLoadingById.values()].slice(-8).map((row) => row.context).filter(Boolean).join(' || ')
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
					rowMessage(element),
					rowContext(element)
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
			const detailTerm = element.closest('dd')?.previousElementSibling
			if (detailTerm?.matches('dt'))
				pieces.push(`field=${detailTerm.textContent.replace(/\s+/g, ' ').trim().slice(0, 120)}`)

			for (let parent = element.parentElement; parent != null && parent.id !== 'main'; parent = parent.parentElement) {
				const entityType = parent.getAttribute('data-entity-field-type')
				const fieldName = parent.getAttribute('data-entity-field-name')
				if (entityType || fieldName)
					pieces.push(`resource=${entityType || '?entity'}.${fieldName || '?field'}`)

				const scrollMarkerLabel = parent.getAttribute('data-scroll-marker-label')
				if (scrollMarkerLabel)
					pieces.push(`section=${scrollMarkerLabel}`)

				const ariaLabel = parent.getAttribute('aria-label')
				if (ariaLabel)
					pieces.push(ariaLabel)

				const id = parent.getAttribute('id')
				if (id)
					pieces.push(`id=#${id}`)
			}

			const heading = element
				.closest('section, article, details, [data-scroll-marker-label], [data-card]')
				?.querySelector('h1, h2, h3, h4, h5, h6, summary')
				?.textContent.replace(/\s+/g, ' ').trim().slice(0, 120)
			if (heading)
				pieces.push(`heading=${heading}`)

			if (pieces.length === 0) {
				for (let parent = element.parentElement; parent != null && parent.id !== 'main'; parent = parent.parentElement)
					pieces.push(`${parent.tagName.toLowerCase()}${parent.id ? `#${parent.id}` : ''}`)
			}

			return [...new Set(pieces)].slice(0, 8).join(' > ')
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

const formatBoundaryOwner = ({
	key,
	context,
}: {
	key: string | null
	context: string
}) => (
	context ?
		(
			key != null
			&& key !== ''
			&& key !== 'Loading…' ?
				`${key}:${context}`
			:
				context
		)
	:
		key ?? 'document=#main'
)

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
					context: loading.context,
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
			`failed:${formatBoundaryOwner(row)}:${row.message || '(no message)'}`
		)
	}

	for (const row of snapshot.loading) {
		issues.push(
			`still-loading:${formatBoundaryOwner(row)}:${row.message || '(no message)'}`
		)
	}

	for (const row of slow) {
		issues.push(
			`slow-loading:${formatBoundaryOwner(row)}:${row.durationMs}ms:${row.message || '(no message)'}`
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
		const token = `console:${event.kind}:${formatBoundaryOwner(event)}`
		if (!issues.some((issue) => issue.includes(formatBoundaryOwner(event)) && issue.startsWith('failed:')))
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
				lines.push(`    [dom] ${formatBoundaryOwner(row)}: ${row.message}`)
			for (const event of report.updates.filter((entry) => (
				entry.kind === 'console-failed'
				|| entry.kind === 'console-uncaught'
			)))
				lines.push(`    [${event.kind}] ${formatBoundaryOwner(event)}: ${event.message}`)
		}
		lines.push('')
	}

	if (loadingRoutes.length > 0) {
		lines.push('Still loading after settle:')
		for (const report of loadingRoutes) {
			lines.push(`  ${report.pathname}`)
			for (const row of report.snapshot.loading)
				lines.push(`    ${formatBoundaryOwner(row)}: ${row.message}`)
		}
		lines.push('')
	}

	if (slowRoutes.length > 0) {
		lines.push('Slow loading boundaries:')
		for (const report of slowRoutes) {
			const tag = optionalPathnames.has(report.pathname) ? ' (optional-live)' : ''
			lines.push(`  ${report.pathname}${tag}`)
			for (const row of report.slow)
				lines.push(`    ${formatBoundaryOwner(row)}: ${row.durationMs}ms: ${row.message}`)
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
				lines.push(`    [${event.kind}] ${event.at}: ${formatBoundaryOwner(event)}: ${event.message}`)
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

export const requestFailureIsResourceCancellation = (
	resourceType: string,
	failure: string | null
) => (
	failure === 'net::ERR_ABORTED'
	&& (
		resourceType === 'fetch'
		|| resourceType === 'xhr'
	)
)

export const setupPageRuntimeDiagnostics = (
	page: Page,
	{
		failFast = true,
		forwardConsole = false,
		failOnDevServerContamination = false,
		failOnTanStackWarnings = false,
		ignoreTransientDevLoad: deprecatedIgnoreTransientDevLoad = false,
	}: {
		failFast?: boolean
		forwardConsole?: boolean
		failOnDevServerContamination?: boolean
		failOnTanStackWarnings?: boolean
		/** @deprecated Browser failures always remain fail-closed. */
		ignoreTransientDevLoad?: boolean
	} = {}
): PageRuntimeDiagnostics => {
	const issues: string[] = []
	const lines: string[] = []
	if (deprecatedIgnoreTransientDevLoad)
		lines.push('ignoreTransientDevLoad is deprecated; browser failures remain fail-closed')

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

		if (message.type() === 'error')
			pushIssue(`console.error:${locationText} ${text}`)
	})
	page.on('response', (response) => {
		if (response.status() < 400) return

		const request = response.request()
		pushIssue(
			`response:${response.status()} ${request.method()} ${response.url()} (${request.resourceType()})`
		)
	})
	page.on('requestfailed', (request) => {
		if (requestFailureIsResourceCancellation(
			request.resourceType(),
			request.failure()?.errorText ?? null
		))
			return

		pushIssue(
			`requestfailed:${request.method()} ${request.url()} (${request.resourceType()}): ${request.failure()?.errorText ?? 'unknown'}`
		)
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

const formatCollectionOwner = (collectionId: string) => {
	try {
		return String(parse(collectionId)).replace(/,/g, '.')
	}
	catch {
		return collectionId
	}
}

export const pageFailureSnapshot = async (page: Page) => {
	if (page.isClosed()) return 'page closed'

	const [pageState, boundaries, boundaryEvents, resourceOwnerTail] = await Promise.all([
		page.evaluate(() => ({
			finalUrl: location.href,
			readyState: document.readyState,
			mainCount: document.querySelectorAll('#main').length,
			mainText: document.querySelector('#main')?.textContent.replace(/\s+/g, ' ').trim().slice(0, 800) ?? '',
		})).catch((error) => ({
			finalUrl: page.url(),
			readyState: `unavailable: ${error}`,
			mainCount: -1,
			mainText: '',
		})),
		snapshotBoundaryMain(page).catch(() => null),
		getBoundaryProbeEvents(page).then((events) => events.slice(-30)).catch(() => []),
		page.evaluate(() => (
			window.__blockheadClientProbe?.events.collectionLoads.slice(-60).map((event) => ({
				collectionId: event.collectionId,
				decision: event.decision,
				status: event.status,
				sourceRowCounts: event.sourceRowCounts,
				reason: event.reason,
				error: event.error,
			})) ?? []
		)).catch(() => []),
	])

	return [
		`url=${pageState.finalUrl} readyState=${pageState.readyState} mainCount=${pageState.mainCount}`,
		`main=${pageState.mainText || '(empty)'}`,
		'boundary owners:',
		...(
			boundaries == null ?
				['- boundary snapshot unavailable']
			:
				[
					...boundaries.failed.map((row) => `- failed ${formatBoundaryOwner(row)}: ${row.message}`),
					...boundaries.loading.map((row) => `- loading ${formatBoundaryOwner(row)}: ${row.message}`),
				]
		),
		...boundaryEvents.filter((event) => (
			event.kind === 'console-failed'
			|| event.kind === 'console-uncaught'
		)).slice(-8).map((event) => (
			`- ${event.kind} ${formatBoundaryOwner(event)}: ${event.message}`
		)),
		'resource/source tail:',
		...resourceOwnerTail.filter((event) => (
			event.error != null
			|| event.status === 'loading'
			|| event.status === 'partial'
		)).slice(-16).map((event) => (
			`- ${formatCollectionOwner(event.collectionId)} | ${event.status ?? event.decision ?? 'observed'}${event.error ? ` | ${event.error}` : ''}${event.reason ? ` | ${event.reason}` : ''}${event.sourceRowCounts ? ` | sources=${Object.keys(event.sourceRowCounts).join(',') || '(none)'}` : ''}`
		)),
	].join('\n')
}

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

export const expectMainAttached = async (
	page: Page,
	timeoutMs = 120_000,
	diagnostics?: PageRuntimeDiagnostics
) => {
	try {
		await (
			diagnostics ?
				diagnostics.step(expect(page.locator('#main')).toBeAttached({ timeout: timeoutMs }))
			:
				expect(page.locator('#main')).toBeAttached({ timeout: timeoutMs })
		)
	}
	catch (error) {
		throw new Error(
			[
				`#main did not become attached within ${timeoutMs}ms`,
				`url=${page.url()}`,
				`runtime issues:\n${diagnostics?.summary() || '(no diagnostics installed or no browser runtime issues captured)'}`,
				`page snapshot:\n${await pageFailureSnapshot(page)}`,
			].join('\n\n'),
			{ cause: error }
		)
	}
}

/** Fail-fast gate for live network pages: `step()` races each await against the first browser failure. */
export const setupNetworkLiveFailFast = (page: Page) => {
	const diagnostics = setupPageRuntimeDiagnostics(page)

	return {
		step: diagnostics.step,
		diagnostics,
	}
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

const bitcoinCashNodeJsonRpcWire = (
	url: string,
	method: string
) => (
	method === 'POST'
	&& url.includes('/api-proxy/')
	&& url.includes('127.0.0.1')
	&& url.includes('8332')
)

const bitcoinCashCashTokenTransactionId = '9c3f790921eab71fe9b210a9884c81708dc55d9444bba8c54394b827e2cf7f5a'
const bitcoinProbeAddress = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
const bitcoinGenesisBlockHash = '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f'
const bitcoinProbeTransactionId = '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b'
const zcashShieldedProbeTransactionId = '7fb6c4d3e2a1908070605040302010ffeeddccbbaa99887766554433221100ff'

const bitcoinCashNodeJsonRpcBody = (post: {
	id?: number | string | null
	method?: string
	params?: JsonValue[]
}) => (
	post.method === 'getrawtransaction'
	&& post.params?.[0] === bitcoinCashCashTokenTransactionId ?
		JSON.stringify({
			jsonrpc: '2.0',
			id: post.id ?? 1,
			result: {
				txid: bitcoinCashCashTokenTransactionId,
				hash: bitcoinCashCashTokenTransactionId,
				version: 2,
				size: 256,
				vsize: 256,
				weight: 1024,
				locktime: 0,
				vin: [
					{
						txid: '0000000000000000000000000000000000000000000000000000000000000000',
						vout: 0,
						scriptSig: {
							asm: '',
							hex: '',
						},
						sequence: 4_294_967_295,
					},
				],
				vout: [
					{
						value: 0.00000546,
						n: 0,
						scriptPubKey: {
							asm: 'OP_DUP OP_HASH160 e2e OP_EQUALVERIFY OP_CHECKSIG',
							hex: '76a914000000000000000000000000000000000000000088ac',
							address: 'bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a',
							type: 'pubkeyhash',
						},
						tokenData: {
							category: 'e2e-cash-token-category',
							amount: '123456789',
							nft: {
								capability: 'mutable',
								commitment: 'e2ec0de',
							},
						},
					},
				],
			},
		})
	:
		undefined
)

const mempoolSpaceAddressWire = (
	url: string,
	method: string
) => (
	method === 'GET'
	&& decodeURIComponent(url).includes(`mempool.space/api/address/${bitcoinProbeAddress}`)
)

const mempoolSpaceAddressBody = JSON.stringify({
	address: bitcoinProbeAddress,
	chain_stats: {
		funded_txo_count: 2,
		funded_txo_sum: 50_000,
		spent_txo_count: 1,
		spent_txo_sum: 12_500,
		tx_count: 3,
	},
	mempool_stats: {
		funded_txo_count: 0,
		funded_txo_sum: 0,
		spent_txo_count: 0,
		spent_txo_sum: 0,
		tx_count: 0,
	},
})

const mempoolSpaceTransactionWire = (
	url: string,
	method: string
) => (
	method === 'GET'
	&& decodeURIComponent(url).includes(`mempool.space/api/tx/${bitcoinProbeTransactionId}`)
)

const mempoolSpaceTransactionBody = JSON.stringify({
	txid: bitcoinProbeTransactionId,
	version: 2,
	locktime: 0,
	size: 225,
	weight: 900,
	fee: 1410,
	vin: [
		{
			txid: '0000000000000000000000000000000000000000000000000000000000000000',
			vout: 0,
			is_coinbase: false,
		},
	],
	vout: [
		{
			scriptpubkey: '001431d466170488e005804a9bc2a4aaa588c2d4d187',
			scriptpubkey_asm: 'OP_0 OP_PUSHBYTES_20 31d466170488e005804a9bc2a4aaa588c2d4d187',
			scriptpubkey_type: 'v0_p2wpkh',
			scriptpubkey_address: bitcoinProbeAddress,
			value: 48_590,
		},
	],
	status: {
		confirmed: true,
		block_height: 0,
		block_hash: bitcoinGenesisBlockHash,
		block_time: 1_231_006_505,
	},
})

const mempoolSpaceBlocksWire = (
	url: string,
	method: string
) => (
	method === 'GET'
	&& decodeURIComponent(url).includes('mempool.space/api/v1/blocks')
)

const mempoolSpaceBlocksBody = JSON.stringify([
	{
		id: bitcoinGenesisBlockHash,
		height: 0,
		version: 1,
		timestamp: 1_231_006_505,
		tx_count: 1,
		size: 285,
		weight: 1_140,
		merkle_root: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
		mediantime: 1_231_006_505,
		nonce: 2_083_236_893,
		bits: 486_604_799,
		difficulty: 1,
	},
])

const mempoolSpaceMempoolStatsWire = (
	url: string,
	method: string
) => (
	method === 'GET'
	&& decodeURIComponent(url).includes('mempool.space/api/mempool')
)

const mempoolSpaceMempoolStatsBody = JSON.stringify({
	count: 2,
	vsize: 512,
	total_fee: 1024,
	fee_histogram: [],
})

const mempoolSpaceRecommendedFeesWire = (
	url: string,
	method: string
) => (
	method === 'GET'
	&& decodeURIComponent(url).includes('mempool.space/api/v1/fees/recommended')
)

const mempoolSpaceRecommendedFeesBody = JSON.stringify({
	fastestFee: 12,
	halfHourFee: 8,
	hourFee: 4,
	economyFee: 2,
	minimumFee: 1,
})

const blockchairBitcoinStatsWire = (
	url: string,
	method: string
) => (
	method === 'GET'
	&& decodeURIComponent(url).includes('api.blockchair.com/bitcoin/stats')
)

const blockchairBitcoinStatsBody = JSON.stringify({
	data: {
		blocks: 1,
		transactions: 1,
		best_block_height: 0,
		best_block_hash: bitcoinGenesisBlockHash,
		best_block_time: '2009-01-03 18:15:05',
		blocks_24h: 1,
		transactions_24h: 1,
		mempool_transactions: 2,
		mempool_size: 512,
		mempool_tps: 0,
		average_transaction_fee_24h: 4,
		median_transaction_fee_24h: 3,
		suggested_transaction_fee_per_byte_sat: 4,
		blockchain_size: 285,
	},
	context: {
		code: 200,
		source: 'E2E',
	},
})

const blockchairBitcoinAddressDashboardWire = (
	url: string,
	method: string
) => (
	method === 'GET'
	&& decodeURIComponent(url).includes(`api.blockchair.com/bitcoin/dashboards/address/${bitcoinProbeAddress}`)
)

const blockchairBitcoinAddressDashboardBody = JSON.stringify({
	data: {
		[bitcoinProbeAddress]: {
			address: {
				type: 'witness_v0_keyhash',
				balance: 37_500,
				received: 50_000,
				spent: 12_500,
				output_count: 2,
				unspent_output_count: 1,
				transaction_count: 3,
			},
			transactions: [],
			utxo: [],
		},
	},
	context: {
		code: 200,
		source: 'E2E',
	},
})

const blockchairBitcoinBlockDashboardWire = (
	url: string,
	method: string
) => (
	method === 'GET'
	&& decodeURIComponent(url).includes('api.blockchair.com/bitcoin/dashboards/block/0')
)

const blockchairBitcoinBlockDashboardBody = JSON.stringify({
	data: {
		[bitcoinGenesisBlockHash]: {
			block: {
				id: 0,
				hash: bitcoinGenesisBlockHash,
				date: '2009-01-03',
				time: '2009-01-03 18:15:05',
				size: 285,
				weight: 1_140,
				version: 1,
				merkle_root: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
				nonce: 2_083_236_893,
				difficulty: 1,
				transaction_count: 1,
			},
			transactions: [],
		},
	},
	context: {
		code: 200,
		source: 'E2E',
	},
})

const blockchairBitcoinBlocksWire = (
	url: string,
	method: string
) => (
	method === 'GET'
	&& decodeURIComponent(url).includes('api.blockchair.com/bitcoin/blocks')
)

const blockchairBitcoinBlocksBody = JSON.stringify({
	data: [
		{
			id: 0,
			hash: bitcoinGenesisBlockHash,
			date: '2009-01-03',
			time: '2009-01-03 18:15:05',
			size: 285,
			weight: 1_140,
			version: 1,
			merkle_root: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
			nonce: 2_083_236_893,
			difficulty: 1,
			transaction_count: 1,
		},
	],
	context: {
		code: 200,
		source: 'E2E',
	},
})

const blockchairBitcoinTransactionDashboardWire = (
	url: string,
	method: string
) => (
	method === 'GET'
	&& decodeURIComponent(url).includes(`api.blockchair.com/bitcoin/dashboards/transaction/${bitcoinProbeTransactionId}`)
)

const blockchairBitcoinTransactionDashboardBody = JSON.stringify({
	data: {
		[bitcoinProbeTransactionId]: {
			transaction: {
				hash: bitcoinProbeTransactionId,
				block_id: 0,
				version: 2,
				lock_time: 0,
				size: 225,
				weight: 900,
				fee: 1410,
				is_coinbase: false,
			},
			inputs: [],
			outputs: [],
		},
	},
	context: {
		code: 200,
		source: 'E2E',
	},
})

/** Matches GETs to public IPFS path gateways (`{origin}/ipfs/…` or `/ipns/…`). */
export const ipfsPublicGatewayGetWire = (url: string) => {
	try {
		const decodedUrl = decodeURIComponent(url)
		const proxyIndex = decodedUrl.indexOf('/api-proxy/')
		const u = new URL(proxyIndex === -1 ? decodedUrl : decodedUrl.slice(proxyIndex + '/api-proxy/'.length))
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

const zcashdJsonRpcWire = (
	url: string,
	method: string
) => (
	method === 'POST'
	&& url.includes('/api-proxy/')
	&& url.includes('127.0.0.1')
	&& url.includes('8232')
)

const zcashdJsonRpcBody = (post: {
	id?: number | string | null
	method?: string
	params?: JsonValue[]
}) => (
	post.method === 'getrawtransaction'
	&& post.params?.[0] === zcashShieldedProbeTransactionId ?
		JSON.stringify({
			jsonrpc: '2.0',
			id: post.id ?? 1,
			result: {
				txid: zcashShieldedProbeTransactionId,
				hash: zcashShieldedProbeTransactionId,
				version: 4,
				size: 512,
				vsize: 512,
				weight: 2048,
				locktime: 0,
				vin: [],
				vout: [],
				vShieldedSpend: [
					{
						cv: 'cv-e2e-sapling-spend',
						anchor: 'anchor-e2e-sapling-spend',
						nullifier: 'nullifier-e2e-sapling-spend',
						rk: 'rk-e2e-sapling-spend',
						zkproof: 'zkproof-e2e-sapling-spend',
						spendAuthSig: 'spend-auth-sig-e2e-sapling-spend',
					},
				],
				vShieldedOutput: [
					{
						cv: 'cv-e2e-sapling-output',
						cmu: 'cmu-e2e-sapling-output',
						ephemeralKey: 'ephemeral-key-e2e-sapling-output',
						encCiphertext: 'enc-ciphertext-e2e-sapling-output',
						outCiphertext: 'out-ciphertext-e2e-sapling-output',
						zkproof: 'zkproof-e2e-sapling-output',
					},
				],
				orchard: {
					actions: [
						{
							cv: 'cv-e2e-orchard-action',
							nullifier: 'nullifier-e2e-orchard-action',
							cmx: 'cmx-e2e-orchard-action',
							ephemeralKey: 'ephemeral-key-e2e-orchard-action',
						},
					],
				},
			},
		})
	:
		undefined
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

const beaconRestWire = (url: string, method: string) => (
	method === 'GET'
	&& (
		url.includes('ethereum-beacon-api.publicnode.com')
		|| (
			url.includes('api-proxy')
			&& url.includes('ethereum-beacon-api.publicnode.com')
		)
	)
)

const MOCK_BEACON_ROOT = `0x${'11'.repeat(32)}`
const MOCK_BEACON_SIGNATURE = `0x${'22'.repeat(96)}`
const MOCK_BEACON_HEADER_BODY = JSON.stringify({
	data: {
		root: MOCK_BEACON_ROOT,
		canonical: true,
		header: {
			message: {
				slot: '12345',
				proposer_index: '1',
				parent_root: MOCK_BEACON_ROOT,
				state_root: MOCK_BEACON_ROOT,
				body_root: MOCK_BEACON_ROOT,
			},
			signature: MOCK_BEACON_SIGNATURE,
		},
	},
})

const MOCK_BEACON_BLOCK_BODY = JSON.stringify({
	data: {
		message: {
			body: {
				attestations: [
					{
						aggregation_bits: '0x01',
						data: {
							index: '0',
						},
					},
				],
				proposer_slashings: [
					{},
				],
				attester_slashings: [],
				execution_payload: {
					withdrawals: [
						{
							index: '0',
							validator_index: '1',
							address: '0x0000000000000000000000000000000000000001',
							amount: '32000000000',
						},
					],
				},
			},
		},
	},
})

const beaconRestBody = (url: string) => (
	url.includes('/eth/v1/beacon/headers/') ?
		MOCK_BEACON_HEADER_BODY
	:
	url.includes('/eth/v2/beacon/blocks/') ?
		MOCK_BEACON_BLOCK_BODY
	:
	url.includes('/eth/v1/beacon/states/')
	&& url.includes('/committees') ?
		JSON.stringify({
			data: [
				{
					slot: '12345',
					index: '0',
					validators: ['1'],
				},
			],
		})
	:
	url.includes('/eth/v1/beacon/states/head/sync_committees') ?
		JSON.stringify({
			data: {
				validators: ['1'],
			},
		})
	:
	url.includes('/eth/v1/beacon/states/head/finality_checkpoints') ?
		JSON.stringify({
			data: {
				previous_justified: {
					epoch: '384',
					root: MOCK_BEACON_ROOT,
				},
				current_justified: {
					epoch: '385',
					root: MOCK_BEACON_ROOT,
				},
				finalized: {
					epoch: '383',
					root: MOCK_BEACON_ROOT,
				},
			},
		})
	:
	url.includes('/eth/v1/beacon/states/head/validators/') ?
		JSON.stringify({
			data: {
				balance: '32000000000',
				status: 'active_ongoing',
				validator: {
					pubkey: `0x${'33'.repeat(48)}`,
					effective_balance: '32000000000',
					slashed: false,
				},
			},
		})
	:
	url.includes('/eth/v1/beacon/genesis') ?
		JSON.stringify({
			data: {
				genesis_time: '1606824023',
			},
		})
	:
	url.includes('/eth/v1/config/fork_schedule') ?
		JSON.stringify({
			data: [
				{
					epoch: '0',
					previous_version: '0x00000000',
					current_version: '0x00000000',
				},
			],
		})
	:
		MOCK_BEACON_HEADER_BODY
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

export const substrateSidecarAccountBalanceInfoWire = (url: string, method: string) => (
	method === 'GET'
	&& url.includes('api-proxy/')
	&& (
		decodeURIComponent(url).includes('http://127.0.0.1:8080/accounts/3/balance-info')
		|| decodeURIComponent(url).includes('http://127.0.0.1:8080/accounts/5GrwvaEF5zXb26Fz9rcQpDWSQVu1csJn3S9qjQg9mT3S7v5F/balance-info')
	)
)

export const substrateSidecarBlockWire = (url: string, method: string) => (
	method === 'GET'
	&& url.includes('api-proxy/')
	&& (
		decodeURIComponent(url).includes('http://127.0.0.1:8080/blocks/0xe4f2e1c70d72388a98dba2a2511a9b480840e544')
		|| decodeURIComponent(url).includes('http://127.0.0.1:8080/blocks/18000000')
	)
)

export const substrateSidecarRuntimeMetadataWire = (url: string, method: string) => (
	method === 'GET'
	&& url.includes('api-proxy/')
	&& decodeURIComponent(url).includes('http://127.0.0.1:8080/runtime/metadata')
)

export const MOCK_SUBSTRATE_SIDECAR_ACCOUNT_BALANCE_INFO_BODY = JSON.stringify({
	nonce: '1',
	free: '1234567890000',
})

export const MOCK_SUBSTRATE_SIDECAR_BLOCK_BODY = JSON.stringify({
	number: '18000000',
	hash: '0xe4f2e1c70d72388a98dba2a2511a9b480840e544',
	parentHash: '0x0000000000000000000000000000000000000000',
	stateRoot: '0x1111111111111111111111111111111111111111',
	extrinsicsRoot: '0x2222222222222222222222222222222222222222',
	onInitialize: {
		events: [
			{
				method: 'System.InitializationStarted',
			},
		],
	},
	extrinsics: [
		{
			method: {
				pallet: 'timestamp',
				method: 'set',
			},
			hash: '0x3333333333333333333333333333333333333333',
			success: true,
			events: [
				{
					method: 'System.ExtrinsicSuccess',
				},
			],
		},
	],
	onFinalize: {
		events: [
			{
				method: 'System.FinalizationStarted',
			},
		],
	},
})

export const MOCK_SUBSTRATE_SIDECAR_RUNTIME_METADATA_BODY = JSON.stringify({
	pallets: [
		{
			name: 'System',
			index: 0,
		},
		{
			name: 'timestamp',
			index: 3,
		},
	],
})

export const subscanBlockWire = (url: string, method: string) => (
	method === 'POST'
	&& decodeURIComponent(url).includes('http://127.0.0.1:8080/api/scan/block')
)

export const MOCK_SUBSCAN_BLOCK_BODY = JSON.stringify({
	code: 0,
	message: 'Success',
	generated_at: 1_700_000_000,
	data: {
		block_num: 18_000_000,
		block_hash: '0xe4f2e1c70d72388a98dba2a2511a9b480840e544',
		parent_hash: '0x00000000000000000000000000000000000000000000',
		state_root: '0x11111111111111111111111111111111111111111111',
		extrinsics_root: '0x22222222222222222222222222222222222222222222',
		event_count: 1,
		extrinsics_count: 1,
	},
})

export const e2eSolanaTokenAccountPubkey = 'E2eTokenAccount1111111111111111111111111111'
export const e2eSolanaTokenMintAddress = 'So11111111111111111111111111111111111111112'
export const e2eSolanaTokenOwnerPubkey = 'ba4df886d2a7c4224bc98efb6cbf3817b0e2b7227c287b692a7c7d0a9e3e86ff'
export const e2eSolanaSignature = 'E2eSolanaSignature11111111111111111111111111111111111111111111111'
export const e2eSolanaProgramId = '11111111111111111111111111111111'
export const e2eSolanaVotePubkey = 'E2eVotePubkey111111111111111111111111111111111111111'
export const e2eSolanaNodePubkey = 'E2eNodePubkey111111111111111111111111111111111111111'

export const solanaJsonRpcWire = (url: string, method: string) => (
	method === 'POST'
	&& (
		url.includes('api.mainnet.solana.com')
		|| (
			url.includes('api-proxy/')
			&& decodeURIComponent(url).includes('api.mainnet.solana.com')
		)
	)
)

export const solanaJsonRpcBody = (post: {
	id?: JsonValue
	method?: string
	params?: JsonValue[]
}) => {
	const account = String(post.params?.[0] ?? '')
	const encoding = (
		post.params?.[1] != null
		&& typeof post.params[1] === 'object'
		&& !Array.isArray(post.params[1])
		&& 'encoding' in post.params[1] ?
			String(post.params[1].encoding)
		:
			''
	)
	const result = (
		post.method === 'getSlot' ?
			9500000
	:
		post.method === 'getEpochInfo' ?
			{
				absoluteSlot: 9500000,
				blockHeight: 9400000,
				epoch: 500,
				slotIndex: 1000,
				slotsInEpoch: 432000,
				transactionCount: 123456789,
			}
	:
		post.method === 'getHealth' ?
			'ok'
	:
		post.method === 'getVersion' ?
			{
				'solana-core': '1.18.0',
				'feature-set': 123456,
			}
	:
		post.method === 'getTransaction' && account === e2eSolanaSignature ?
			{
				slot: 9500000,
				blockTime: 1700000000,
				transaction: {
					signatures: [e2eSolanaSignature],
					message: {
						accountKeys: [
							{
								pubkey: e2eSolanaTokenOwnerPubkey,
								signer: true,
								writable: true,
							},
							{
								pubkey: e2eSolanaProgramId,
								signer: false,
								writable: false,
							},
						],
						instructions: [
							{
								programId: e2eSolanaProgramId,
								parsed: {
									type: 'transfer',
								},
								accounts: [
									e2eSolanaTokenOwnerPubkey,
									e2eSolanaTokenAccountPubkey,
								],
								stackHeight: 1,
							},
						],
					},
				},
				meta: {
					err: null,
					fee: 5000,
					computeUnitsConsumed: 1200,
					innerInstructions: [
						{
							index: 0,
							instructions: [
								{
									programId: e2eSolanaProgramId,
									accounts: [
										e2eSolanaTokenAccountPubkey,
									],
									data: '3Bxs',
									stackHeight: 2,
								},
							],
						},
					],
				},
			}
	:
		post.method === 'getSignatureStatuses' ?
			{
				value: [
					{
						slot: 9500000,
						confirmations: null,
						err: null,
						confirmationStatus: 'finalized',
					},
				],
			}
	:
		post.method === 'getVoteAccounts' ?
			{
				current: [
					{
						activatedStake: 1_000_000_000,
						commission: 5,
						epochVoteAccount: true,
						lastVote: 9499999,
						nodePubkey: e2eSolanaNodePubkey,
						rootSlot: 9499900,
						votePubkey: e2eSolanaVotePubkey,
					},
				],
				delinquent: [],
			}
	:
		post.method === 'getAccountInfo' && encoding === 'jsonParsed' && account === e2eSolanaTokenAccountPubkey ?
			{
				value: {
					data: {
						parsed: {
							info: {
								mint: e2eSolanaTokenMintAddress,
								owner: e2eSolanaTokenOwnerPubkey,
								tokenAmount: {
									amount: '123456789',
									decimals: 9,
									uiAmountString: '0.123456789',
								},
								state: 'initialized',
								isNative: false,
							},
						},
					},
				},
			}
		:
		post.method === 'getAccountInfo' && encoding === 'jsonParsed' && account === e2eSolanaTokenMintAddress ?
			{
				value: {
					data: {
						parsed: {
							info: {
								supply: '1000000000000',
								decimals: 9,
								isInitialized: true,
							},
						},
					},
				},
			}
		:
		post.method === 'getAccountInfo' && (
			account === e2eSolanaTokenAccountPubkey
			|| account === e2eSolanaTokenOwnerPubkey
			|| account === e2eSolanaTokenMintAddress
			|| account === e2eSolanaProgramId
			|| account === e2eSolanaVotePubkey
			|| account === e2eSolanaNodePubkey
		) ?
			{
				value: {
					lamports: 1_000_000,
					owner: e2eSolanaTokenMintAddress,
					executable: false,
					rentEpoch: 0,
					data: ['', 'base64'],
				},
			}
		:
			undefined
	)
	return result === undefined ?
		undefined
	:
		JSON.stringify({
			jsonrpc: '2.0',
			id: post.id ?? 1,
			result,
		})
}

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

export const coingeckoDerivativesExchangeWire = (url: string, method: string) => (
	method === 'GET'
	&& decodeURIComponent(url).includes('/api/v3/derivatives/exchanges/')
	&& (
		url.includes('api.coingecko.com')
		|| (url.includes('api-proxy') && url.includes('api.coingecko.com'))
	)
)

export const MOCK_COINGECKO_DERIVATIVES_EXCHANGE_BODY = JSON.stringify({
	name: 'E2E derivatives exchange',
	open_interest_btc: 1,
	trade_volume_24h_btc: 1,
	number_of_perpetual_pairs: 1,
	number_of_futures_pairs: 0,
	tickers: [
		{
			symbol: 'ETHUSDT',
			base: 'ETH',
			target: 'USDT',
			coin_id: 'ethereum',
			target_coin_id: 'tether',
			contract_type: 'perpetual',
			expired_at: null,
			last: 3000,
			index: 3000,
			basis: 0,
			spread: 0,
			funding_rate: 0.01,
			open_interest_usd: 1000000,
			volume_24h: 1000,
		},
	],
})

export const lightningLndRestInvoicesWire = (url: string, method: string) => (
	method === 'GET'
	&& url.includes('api-proxy/')
	&& (
		decodeURIComponent(url).includes('http://127.0.0.1:8080/v1/invoices')
		|| decodeURIComponent(url).includes('https://127.0.0.1:8080/v1/invoices')
		|| decodeURIComponent(url).includes('http://localhost:8080/v1/invoices')
		|| decodeURIComponent(url).includes('https://localhost:8080/v1/invoices')
	)
)

export const lightningLndRestGetInfoWire = (url: string, method: string) => (
	method === 'GET'
	&& url.includes('api-proxy/')
	&& (
		decodeURIComponent(url).includes('http://127.0.0.1:8080/v1/getinfo')
		|| decodeURIComponent(url).includes('https://127.0.0.1:8080/v1/getinfo')
		|| decodeURIComponent(url).includes('http://localhost:8080/v1/getinfo')
		|| decodeURIComponent(url).includes('https://localhost:8080/v1/getinfo')
	)
)

export const lightningLndRestChannelsWire = (url: string, method: string) => (
	method === 'GET'
	&& url.includes('api-proxy/')
	&& (
		decodeURIComponent(url).includes('http://127.0.0.1:8080/v1/channels')
		|| decodeURIComponent(url).includes('https://127.0.0.1:8080/v1/channels')
		|| decodeURIComponent(url).includes('http://localhost:8080/v1/channels')
		|| decodeURIComponent(url).includes('https://localhost:8080/v1/channels')
	)
)

export const lightningLndRestPaymentsWire = (url: string, method: string) => (
	method === 'GET'
	&& url.includes('api-proxy/')
	&& (
		decodeURIComponent(url).includes('http://127.0.0.1:8080/v1/payments')
		|| decodeURIComponent(url).includes('https://127.0.0.1:8080/v1/payments')
		|| decodeURIComponent(url).includes('http://localhost:8080/v1/payments')
		|| decodeURIComponent(url).includes('https://localhost:8080/v1/payments')
	)
)

export const MOCK_LIGHTNING_LND_GETINFO_BODY = JSON.stringify({
	version: '0.18.0-beta',
	identity_pubkey: '02aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
	alias: 'Blockhead E2E LND',
	color: '#3399ff',
	num_active_channels: 1,
	num_inactive_channels: 0,
	uris: [
		'02aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@127.0.0.1:9735',
	],
})

export const MOCK_LIGHTNING_LND_CHANNELS_BODY = JSON.stringify({
	channels: [
		{
			active: true,
			remote_pubkey: '03bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
			channel_point: `${'11'.repeat(32)}:0`,
			chan_id: '852861482917888001',
			capacity: '100000',
			local_balance: '60000',
			remote_balance: '40000',
			private: false,
			initiator: true,
		},
	],
})

export const MOCK_LIGHTNING_LND_PAYMENTS_BODY = JSON.stringify({
	payments: [
		{
			payment_hash: 'e2e-probe-paymentHash',
			payment_preimage: 'e2e-probe-paymentPreimage',
			value_msat: '123000',
			fee_msat: '1000',
			creation_date: '1700000100',
			payment_request: 'lnbc1230n1e2e',
			status: 'SUCCEEDED',
			payment_index: '1',
		},
	],
})

export const MOCK_LIGHTNING_LND_INVOICES_BODY = JSON.stringify({
	invoices: [
		{
			memo: 'E2E Lightning invoice',
			r_hash_str: 'e2e-probe-paymentHash',
			value: '123',
			value_msat: '123000',
			settled: false,
			creation_date: '1700000000',
			expiry: '3600',
			private: false,
			add_index: '1',
			amt_paid_msat: '0',
			state: 'OPEN',
		},
	],
})

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

const e2eMevBuilderPubkey = `0x${'11'.repeat(48)}` as const

const mevRelayRestWire = (url: string, method: string) => (
	method === 'GET'
	&& decodeURIComponent(url).includes('/relay/v1/data/bidtraces/proposer_payload_delivered')
	&& (
		url.includes('relay.ultrasound.money')
		|| url.includes('boost-relay.flashbots.net')
		|| url.includes('api-proxy/')
	)
)

const mevRelayProposerPayloadDeliveredBody = JSON.stringify([
	{
		slot: '9500000',
		block_hash: '0x0000000000000000000000000000000000000000000000000000000000000001',
		builder_pubkey: e2eMevBuilderPubkey,
		proposer_fee_recipient: '0x0000000000000000000000000000000000000001',
		value: '100000000000000000',
		block_number: '18000000',
	},
])

const etherscanInternalTransactionsWire = (url: string, method: string) => (
	method === 'GET'
	&& (
		url.includes('api.etherscan.io')
		|| url.includes('api-proxy/')
	)
	&& decodeURIComponent(url).includes('action=txlistinternal')
)

const etherscanInternalTransactionsBody = JSON.stringify({
	status: '1',
	message: 'OK',
	result: [
		{
			blockNumber: '18000000',
			timeStamp: '1692839040',
			hash: '0x6b2fe3575bc0e2b9220daf457d7bde7a118d8674b920a0c888bbf547d683d0b7',
			from: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
			to: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			value: '1000000000000000',
			contractAddress: '',
			input: '0x',
			type: 'call',
			gas: '21000',
			gasUsed: '21000',
			traceId: '0',
			isError: '0',
			errCode: '',
		},
	],
})

const blockscoutInternalTransactionsWire = (url: string, method: string) => (
	method === 'GET'
	&& decodeURIComponent(url).includes('/api/v2/transactions/')
	&& decodeURIComponent(url).includes('/internal-transactions')
	&& (
		url.includes('eth.blockscout.com')
		|| url.includes('api-proxy/')
	)
)

const blockscoutInternalTransactionsBody = JSON.stringify({
	items: [
		{
			block_number: 18_000_000,
			error: null,
			from: {
				hash: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
			},
			gas_limit: '21000',
			index: 0,
			success: true,
			timestamp: '2023-08-24T01:04:00Z',
			to: {
				hash: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			transaction_hash: '0x6b2fe3575bc0e2b9220daf457d7bde7a118d8674b920a0c888bbf547d683d0b7',
			type: 'call',
			value: '1000000000000000',
		},
	],
	next_page_params: null,
})

const blockscoutTokenTransfersWire = (url: string, method: string) => (
	method === 'GET'
	&& decodeURIComponent(url).includes('/api/v2/transactions/')
	&& decodeURIComponent(url).includes('/token-transfers')
	&& (
		url.includes('eth.blockscout.com')
		|| url.includes('api-proxy/')
	)
)

const blockscoutTokenTransfersBody = JSON.stringify({
	items: [
		{
			block_hash: '0x0000000000000000000000000000000000000000000000000000000000000002',
			block_number: 18_000_000,
			from: {
				hash: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
			},
			log_index: 0,
			method: 'transfer',
			timestamp: '2023-08-24T01:04:00Z',
			to: {
				hash: '0x0000000000000000000000000000000000000001',
			},
			token: {
				address_hash: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
				decimals: '6',
				name: 'USD Coin',
				symbol: 'USDC',
				type: 'ERC-20',
			},
			total: {
				decimals: '6',
				value: '1000000',
			},
			transaction_hash: '0x6b2fe3575bc0e2b9220daf457d7bde7a118d8674b920a0c888bbf547d683d0b7',
			type: 'token_transfer',
		},
	],
	next_page_params: null,
})

const blockscoutTokenAddressDetailsWire = (url: string, method: string) => (
	method === 'GET'
	&& decodeURIComponent(url).includes('/api/v2/addresses/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')
	&& !decodeURIComponent(url).includes('/token-transfers')
	&& !decodeURIComponent(url).includes('/internal-transactions')
	&& !decodeURIComponent(url).includes('/transactions')
	&& !decodeURIComponent(url).includes('/counters')
	&& (
		url.includes('eth.blockscout.com')
		|| url.includes('api-proxy/')
	)
)

const blockscoutTokenAddressDetailsBody = JSON.stringify({
	hash: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
	is_contract: true,
	name: 'USD Coin',
	token: {
		address_hash: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
		decimals: '6',
		icon_url: 'https://eth.blockscout.com/token-icon-usdc.png',
		name: 'USD Coin',
		symbol: 'USDC',
		type: 'ERC-20',
	},
})

const blockscoutTransactionLogsWire = (url: string, method: string) => (
	method === 'GET'
	&& decodeURIComponent(url).includes('/api/v2/transactions/')
	&& decodeURIComponent(url).includes('/logs')
	&& (
		url.includes('eth.blockscout.com')
		|| url.includes('api-proxy/')
	)
)

const blockscoutTransactionLogsBody = JSON.stringify({
	items: [
		{
			address_hash: {
				hash: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			},
			block_number: 18_000_000,
			data: '0x',
			index: 0,
			topics: [
				'0x0000000000000000000000000000000000000000000000000000000000000000',
			],
			transaction_hash: '0x6b2fe3575bc0e2b9220daf457d7bde7a118d8674b920a0c888bbf547d683d0b7',
		},
	],
	next_page_params: null,
})

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
const snapchainVerificationPageBody = JSON.stringify({
	messages: [
		{
			data: {
				verificationAddAddressBody: {
					address: '0xd8da6bf26964af9d7eed9e403e826090792bed6a',
					protocol: 'PROTOCOL_ETHEREUM',
				},
			},
		},
	],
})
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
			text: 'E2E Snapchain cast\n\nhttps://x.com/Caol_MacCormaic/status/1989409340495904773?s=20',
			mentions: [],
			embeds: [
				{
					url: 'https://x.com/Caol_MacCormaic/status/1989409340495904773?s=20',
				},
			],
		},
	},
}
const snapchainCastBody = JSON.stringify(snapchainCast)
const snapchainCastPageBody = JSON.stringify({
	messages: [
		snapchainCast,
	],
})

const e2eNostrProfilePubkey = nostrNetworkSeedProfiles[0].pubkey
const e2eNostrNoteEventId = nostrNetworkSeedNotes[0].eventId
const e2eNostrRelayUrl = nostrNetworkSeedRelays[0].relayUrl
const e2eNostrRepostEventId = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
const e2eNostrReactionEventId = 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc'
const e2eNostrReplyEventId = 'dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd'
const e2eNostrArticleEventId = 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
const e2eNostrArticleIdentifier = 'blockhead-e2e-article'

const e2eNostrProfileEvent = {
	id: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
	pubkey: e2eNostrProfilePubkey,
	created_at: 1_710_000_000,
	kind: 0,
	tags: [],
	content: JSON.stringify({
		name: 'blockhead-e2e',
		display_name: 'Blockhead E2E',
		about: 'NostrBand e2e profile stub',
		website: 'https://blockhead.info',
		nip05: 'e2e@blockhead.info',
	}),
	sig: '0'.repeat(128),
}

const e2eNostrNoteEvent = {
	id: e2eNostrNoteEventId,
	pubkey: e2eNostrProfilePubkey,
	created_at: nostrNetworkSeedNotes[0].createdAt,
	kind: 1,
	tags: [],
	content: nostrNetworkSeedNotes[0].content,
	sig: '1'.repeat(128),
}

const e2eNostrRepostEvent = {
	id: e2eNostrRepostEventId,
	pubkey: e2eNostrProfilePubkey,
	created_at: 1_710_000_060,
	kind: 6,
	tags: [
		['e', e2eNostrNoteEventId],
		['p', e2eNostrProfilePubkey],
	],
	content: '',
	sig: '2'.repeat(128),
}

const e2eNostrReactionEvent = {
	id: e2eNostrReactionEventId,
	pubkey: e2eNostrProfilePubkey,
	created_at: 1_710_000_120,
	kind: 7,
	tags: [
		['e', e2eNostrNoteEventId],
		['p', e2eNostrProfilePubkey],
	],
	content: '+',
	sig: '3'.repeat(128),
}

const e2eNostrReplyEvent = {
	id: e2eNostrReplyEventId,
	pubkey: e2eNostrProfilePubkey,
	created_at: 1_710_000_180,
	kind: 1,
	tags: [
		['e', e2eNostrNoteEventId, e2eNostrRelayUrl, 'root'],
		['e', e2eNostrNoteEventId, e2eNostrRelayUrl, 'reply'],
		['p', e2eNostrProfilePubkey],
	],
	content: 'Blockhead Nostr e2e reply',
	sig: '4'.repeat(128),
}

const e2eNostrArticleEvent = {
	id: e2eNostrArticleEventId,
	pubkey: e2eNostrProfilePubkey,
	created_at: 1_710_000_240,
	kind: 30023,
	tags: [
		['d', e2eNostrArticleIdentifier],
		['title', 'Blockhead E2E Nostr article'],
		['summary', 'NostrBand e2e article stub'],
		['published_at', '1710000240'],
	],
	content: 'Blockhead Nostr e2e article body',
	sig: '5'.repeat(128),
}

const e2eNostrEventById: Record<string, object> = {
	[e2eNostrNoteEventId]: e2eNostrNoteEvent,
	[e2eNostrRepostEventId]: e2eNostrRepostEvent,
	[e2eNostrReactionEventId]: e2eNostrReactionEvent,
	[e2eNostrReplyEventId]: e2eNostrReplyEvent,
	[e2eNostrArticleEventId]: e2eNostrArticleEvent,
}

const nostrBandRestWire = (url: string, method: string) => (
	method === 'GET'
	&& (
		url.includes('api.nostr.band/v0/')
		|| (
			url.includes('api-proxy/')
			&& url.includes('api.nostr.band')
		)
	)
)

const primalRestWire = (url: string, method: string) => (
	(
		method === 'GET'
		|| method === 'POST'
	)
	&& (
		url.includes('api.primal.net/v1/')
		|| (
			url.includes('api-proxy/')
			&& url.includes('api.primal.net')
		)
	)
)

const nostrRelayNip11Wire = (url: string, method: string) => (
	method === 'GET'
	&& url.includes('api-proxy/')
	&& decodeURIComponent(url).includes('/api-proxy/https://relay.damus.io')
)

const nostrBandRestBody = (url: string) => {
	const decodedUrl = decodeURIComponent(url)
	const path = decodedUrl.slice(decodedUrl.indexOf('/v0/'))
	const eventId = path.match(/\/events\/e\/([0-9a-f]{64})(?:[/?]|$)/)?.[1]
	const authorPubkey = path.match(/\/events\/authors\/([0-9a-f]{64})(?:[/?]|$)/)?.[1]

	return JSON.stringify(
		path.includes('/users/profile/') ?
			{
				pubkey: e2eNostrProfilePubkey,
				profile: e2eNostrProfileEvent,
				metadata: JSON.parse(e2eNostrProfileEvent.content),
			}
		:
		path.includes('/stats/profile/list') ?
			{
				profiles: [
					{
						pubkey: e2eNostrProfilePubkey,
						profile: e2eNostrProfileEvent,
						followers_count: 1,
						notes_count: 1,
					},
				],
			}
		:
		path.includes('/stats/relay/list') ?
			{
				relays: [
					{
						url: e2eNostrRelayUrl,
						name: 'relay.damus.io',
						description: 'Nostr relay e2e stub',
						software: 'strfry',
						version: 'e2e',
						nips: [1, 11],
						is_paid: false,
						limit: 100,
					},
				],
			}
		:
		eventId != null && path.includes('/reply') ?
			{
				events: eventId === e2eNostrNoteEventId ? [e2eNostrReplyEvent] : [],
			}
		:
		eventId != null && path.includes('/related') ?
			{
				events: eventId === e2eNostrNoteEventId ? [e2eNostrReactionEvent] : [],
			}
		:
			eventId != null ?
				{
					event: e2eNostrEventById[eventId],
				}
		:
		authorPubkey != null ?
			{
				events: authorPubkey === e2eNostrProfilePubkey ?
					[
						e2eNostrNoteEvent,
						e2eNostrRepostEvent,
						e2eNostrArticleEvent,
					]
				:
					[],
			}
		:
		path.includes('/events/recent') && decodedUrl.includes('kinds=6') ?
			{
				events: [e2eNostrRepostEvent],
			}
		:
		path.includes('/events/recent') && decodedUrl.includes('kinds=30023') ?
			{
				events: [e2eNostrArticleEvent],
			}
		:
			{
				events: [e2eNostrNoteEvent],
			}
	)
}

const primalRestBody = (url: string, post?: {
	event_id?: string
	kind?: number
	kinds?: number[]
	pubkey?: string
}) => {
	const decodedUrl = decodeURIComponent(url)
	const path = decodedUrl.slice(decodedUrl.indexOf('/v1/'))
	const eventId = (
		path.match(/\/events\/([0-9a-f]{64})(?:[/?]|$)/)?.[1]
		?? post?.event_id
	)

	return JSON.stringify(
		path.includes('/profile/') ?
			{
				profile: e2eNostrProfileEvent,
				metadata: e2eNostrProfileEvent,
			}
		:
		path.includes('/events/') && eventId != null ?
			{
				event: e2eNostrEventById[eventId],
			}
		:
		path.includes('/timeline/profile/notes') ?
			{
				events: post?.pubkey === e2eNostrProfilePubkey ? [e2eNostrNoteEvent] : [],
			}
		:
		path.includes('/timeline/profile/reposts') ?
			{
				reposts: post?.pubkey === e2eNostrProfilePubkey ? [e2eNostrRepostEvent] : [],
			}
		:
		path.includes('/timeline/profile/articles') ?
			{
				articles: post?.pubkey === e2eNostrProfilePubkey ? [e2eNostrArticleEvent] : [],
			}
		:
		path.includes('/timeline/event/actions') && post?.kind === 7 ?
			{
				actions: eventId === e2eNostrNoteEventId ? [e2eNostrReactionEvent] : [],
			}
		:
		path.includes('/timeline/event/actions') ?
			{
				actions: eventId === e2eNostrNoteEventId ? [e2eNostrReplyEvent] : [],
			}
		:
		path.includes('/timeline/thread') ?
			{
				events: eventId === e2eNostrNoteEventId ? [e2eNostrNoteEvent, e2eNostrReplyEvent] : [],
			}
		:
		path.includes('/search/users') ?
			{
				users: [e2eNostrProfileEvent],
			}
		:
		path.includes('/search/events') && post?.kinds?.includes(7) ?
			{
				events: [e2eNostrReactionEvent],
			}
		:
		path.includes('/search/events') && post?.kinds?.includes(30023) ?
			{
				events: [e2eNostrArticleEvent],
			}
		:
		path.includes('/search/events') && post?.kinds?.includes(6) ?
			{
				events: [e2eNostrRepostEvent],
			}
		:
			{
				events: [e2eNostrNoteEvent],
			}
	)
}

const MOCK_NOSTR_RELAY_NIP11_BODY = JSON.stringify({
	name: 'relay.damus.io',
	description: 'Nostr relay e2e NIP-11 stub',
	software: 'strfry',
	version: 'e2e',
	supported_nips: [1, 11],
	limitation: {
		max_message_length: 100,
	},
})

const e2eActivityPubMastodonAccount = {
	id: '13179',
	username: 'Gargron',
	acct: 'Gargron',
	display_name: 'E2E Gargron',
	url: `${mastodonInstanceByKey.mastodon_social.origin}/@Gargron`,
	uri: `${mastodonInstanceByKey.mastodon_social.origin}/users/Gargron`,
	note: 'Mastodon e2e account',
	avatar: '',
	header: '',
	followers_count: 1,
	following_count: 2,
	statuses_count: 3,
	created_at: '2024-01-01T00:00:00.000Z',
}

const e2eActivityPubFosstodonAccount = {
	id: '109287',
	username: 'fosstodon',
	acct: 'fosstodon',
	display_name: 'E2E Fosstodon',
	url: `${mastodonInstanceByKey.fosstodon.origin}/@fosstodon`,
	uri: `${mastodonInstanceByKey.fosstodon.origin}/users/fosstodon`,
	note: 'Fosstodon e2e account',
	avatar: '',
	header: '',
	followers_count: 4,
	following_count: 5,
	statuses_count: 6,
	created_at: '2024-01-01T00:00:00.000Z',
}

const e2eActivityPubMastodonStatus = {
	id: '116539053870420123',
	uri: `${mastodonInstanceByKey.mastodon_social.origin}/users/Gargron/statuses/116539053870420123`,
	url: `${mastodonInstanceByKey.mastodon_social.origin}/@Gargron/116539053870420123`,
	content: '<p>Mastodon e2e status</p>',
	created_at: '2024-01-01T00:00:00.000Z',
	account: e2eActivityPubMastodonAccount,
	media_attachments: [],
	favourites_count: 7,
	reblogs_count: 8,
	replies_count: 9,
}

const e2eActivityPubFosstodonStatus = {
	id: '116868173373714070',
	uri: `${mastodonInstanceByKey.fosstodon.origin}/users/fosstodon/statuses/116868173373714070`,
	url: `${mastodonInstanceByKey.fosstodon.origin}/@fosstodon/116868173373714070`,
	content: '<p>Fosstodon e2e status</p>',
	created_at: '2024-01-01T00:00:00.000Z',
	account: e2eActivityPubFosstodonAccount,
	media_attachments: [],
	favourites_count: 10,
	reblogs_count: 11,
	replies_count: 12,
}

const activityPubRestWire = (url: string, method: string) => (
	method === 'GET'
	&& (
		url.includes('mastodon.social/api/')
		|| url.includes('fosstodon.org/api/')
	)
)

const activityPubRemoteUrl = (url: string) => {
	const decodedUrl = decodeURIComponent(url)
	const proxyIndex = decodedUrl.indexOf('/api-proxy/')
	return new URL(proxyIndex === -1 ? decodedUrl : decodedUrl.slice(proxyIndex + '/api-proxy/'.length))
}

const activityPubRestBody = (url: string) => {
	const remoteUrl = activityPubRemoteUrl(url)
	const mastodon = remoteUrl.origin === mastodonInstanceByKey.mastodon_social.origin
	const account = mastodon ? e2eActivityPubMastodonAccount : e2eActivityPubFosstodonAccount
	const status = mastodon ? e2eActivityPubMastodonStatus : e2eActivityPubFosstodonStatus
	const path = remoteUrl.pathname
	return JSON.stringify(
		path.endsWith('/instance') ?
			{
				title: mastodon ? 'Mastodon e2e' : 'Fosstodon e2e',
				uri: remoteUrl.origin,
				short_description: 'ActivityPub e2e instance',
				description: 'ActivityPub e2e instance',
				email: 'e2e@example.com',
				version: 'e2e',
				languages: ['en'],
			}
		:
		path.endsWith('/instance/peers') ?
			[
				mastodonInstanceByKey.mastodon_social.origin.replace('https://', ''),
				mastodonInstanceByKey.fosstodon.origin.replace('https://', ''),
			]
		:
		path.endsWith('/instance/domain_blocks') ?
			[
				{
					domain: 'blocked.example',
					severity: 'suspend',
					comment: 'E2E moderated domain',
				},
			]
		:
		path.endsWith('/timelines/public') ?
			[status]
		:
		path.includes('/accounts/lookup') ?
			account
		:
		path.includes('/accounts/') && path.endsWith('/statuses') ?
			[status]
		:
		path.includes('/accounts/') ?
			account
		:
		path.includes('/statuses/') && path.endsWith('/context') ?
			{
				ancestors: [],
				descendants: [],
			}
		:
		path.includes('/statuses/') ?
			status
		:
		path.endsWith('/search') ?
			{
				accounts: [account],
				statuses: [status],
				hashtags: [],
			}
		:
			{}
	)
}

const e2eRedditSubredditName = redditNetworkSeedSubreddits[1].name
const e2eRedditLink = redditNetworkSeedLinks[0]
const e2eRedditComment = redditNetworkSeedComments[0]

const e2eRedditLinkThing = {
	kind: 't3',
	data: {
		name: e2eRedditLink.fullname,
		title: e2eRedditLink.title,
		selftext: 'Blockhead Reddit public JSON e2e link',
		author: e2eRedditLink.author.replace(/^\/u\//, ''),
		url: `https://www.reddit.com${e2eRedditLink.permalink}`,
		subreddit: e2eRedditLink.subredditName,
		permalink: e2eRedditLink.permalink,
		created_utc: Math.floor(e2eRedditLink.createdAt / 1_000),
		score: 42,
		num_comments: 1,
	},
}

const e2eRedditCommentThing = {
	kind: 't1',
	data: {
		name: e2eRedditComment.fullname,
		body: e2eRedditComment.body,
		author: e2eRedditComment.author.replace(/^\/u\//, ''),
		created_utc: Math.floor(e2eRedditComment.createdAt / 1_000),
		score: 7,
		depth: 0,
		link_id: e2eRedditComment.linkFullname,
		parent_id: e2eRedditComment.linkFullname,
		replies: '',
	},
}

const redditPublicJsonWire = (url: string, method: string) => (
	method === 'GET'
	&& (
		url.includes('www.reddit.com/')
		|| url.includes('old.reddit.com/')
		|| (
			url.includes('api-proxy/')
			&& (
				url.includes('www.reddit.com')
				|| url.includes('old.reddit.com')
			)
		)
	)
)

const redditListingBody = (children: JsonValue[]) => JSON.stringify({
	kind: 'Listing',
	data: {
		children,
	},
})

const redditCommentsBody = JSON.stringify([
	{
		kind: 'Listing',
		data: {
			children: [e2eRedditLinkThing],
		},
	},
	{
		kind: 'Listing',
		data: {
			children: [e2eRedditCommentThing],
		},
	},
])

const redditPublicJsonBody = (url: string) => {
	const decodedUrl = decodeURIComponent(url)
	const pathStart = decodedUrl.indexOf('.com/')
	const path = pathStart === -1 ? decodedUrl : decodedUrl.slice(pathStart + 4)
	const id = new URL(decodedUrl).searchParams.get('id')

	return (
		path.startsWith('/api/info.json') && id === e2eRedditLink.fullname ?
			redditListingBody([e2eRedditLinkThing])
		:
		path.startsWith('/api/info.json') && id === e2eRedditComment.fullname ?
			redditListingBody([e2eRedditCommentThing])
		:
		path.startsWith(`/r/${e2eRedditSubredditName}/about.json`) ?
			JSON.stringify({
				kind: 't5',
				data: {
					display_name: e2eRedditSubredditName,
					title: `r/${e2eRedditSubredditName}`,
					public_description: 'Ethereum e2e subreddit',
					subscribers: 1_000_000,
					active_user_count: 1_000,
					created_utc: 1_700_000_000,
					over18: false,
					icon_img: '',
					community_icon: '',
				},
			})
		:
		path.startsWith(`/r/${e2eRedditSubredditName}/hot.json`) ?
			redditListingBody([e2eRedditLinkThing])
		:
		path.startsWith('/r/popular/hot.json') ?
			redditListingBody([e2eRedditLinkThing])
		:
		path.startsWith(`/comments/${e2eRedditLink.fullname.slice(3)}.json`) ?
			redditCommentsBody
		:
			redditListingBody([])
	)
}

const e2eRssItemGuid = 'https://news.ycombinator.com/item?id=48594706'

const rssRestWire = (url: string, method: string) => (
	method === 'GET'
	&& url.includes('api-proxy/')
	&& rssNetworkSeedFeeds.some((feed) => (
		decodeURIComponent(url).includes(feed.feedUrl)
	))
)

const rssRestBody = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
	<channel>
		<title>Hacker News e2e</title>
		<link>https://news.ycombinator.com/</link>
		<description>RSS e2e source fixture</description>
		<item>
			<title>Blockhead RSS e2e item</title>
			<link>${e2eRssItemGuid}</link>
			<guid>${e2eRssItemGuid}</guid>
			<description>RSS item resolver fixture</description>
			<pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
			<comments>${e2eRssItemGuid}</comments>
		</item>
	</channel>
</rss>`

const eip8004AgentChainId = 1
const eip8004AgentContractAddress = '0x8004a169fb4a3325136eb29fa0ceb6d2e539a432'
const eip8004AgentTokenId = '104776'
const eip8004AgentWalletAddress = '0xd8da6bf26964af9d7eed9e403e826090792bed6a'

const eip8004ScanRestWire = (url: string, method: string) => (
	method === 'GET'
	&& decodeURIComponent(url).includes('8004scan.io/api/v1/public/agents')
)

const eip8004ScanAgentWire = {
	token_id: eip8004AgentTokenId,
	chain_id: eip8004AgentChainId,
	contract_address: eip8004AgentContractAddress,
	agent_id: eip8004AgentTokenId,
	agent_wallet: eip8004AgentWalletAddress,
	owner_address: eip8004AgentWalletAddress,
	name: 'Blockhead EIP-8004 Agent',
	description: 'EIP-8004 agent resolver fixture',
	image_url: 'https://example.com/eip8004-agent.png',
	x402_supported: true,
	is_active: true,
	supported_trust_models: [
		'reputation',
	],
	raw_metadata: {
		offchain_uri: 'https://example.com/.well-known/agent-card.json',
		offchain_content: {
			type: 'https://eips.ethereum.org/EIPS/eip-8004',
		},
	},
	services: {
		default: {
			endpoint: 'https://example.com/agent',
		},
	},
}

const eip8004ScanRestBody = (url: string) => (
	decodeURIComponent(url).includes(`/agents/${String(eip8004AgentChainId)}/${eip8004AgentTokenId}`) ?
		JSON.stringify({
			success: true,
			data: eip8004ScanAgentWire,
		})
	:
		JSON.stringify({
			success: true,
			data: [
				eip8004ScanAgentWire,
			],
			meta: {
				pagination: {
					page: 1,
					limit: 100,
					total: 1,
					hasMore: false,
				},
			},
		})
)

const e2eXUserId = '783214'
const e2eXPostId = '1855943488122347520'

const fxEmbedRestWire = (url: string, method: string) => (
	method === 'GET'
	&& decodeURIComponent(url).includes('api.fxtwitter.com/2/')
)

const e2eFxEmbedUser = {
	type: 'profile',
	id: e2eXUserId,
	name: 'Blockhead X E2E',
	screen_name: 'blockhead_e2e',
	description: 'FxEmbed e2e profile fixture',
	location: 'Internet',
	url: 'https://x.com/blockhead_e2e',
	avatar_url: null,
	followers: 123,
	following: 45,
	statuses: 6,
	joined: '2024-01-01T00:00:00.000Z',
	verification: {
		verified: false,
	},
}

const e2eFxEmbedStatus = {
	type: 'status',
	id: e2eXPostId,
	text: 'Blockhead FxEmbed e2e status',
	created_at: '2024-01-01T00:00:00.000Z',
	created_timestamp: 1_704_067_200,
	likes: 10,
	reposts: 2,
	replies: 3,
	quotes: 1,
	author: e2eFxEmbedUser,
	provider: 'fxembed',
	replying_to: null,
	quote: null,
}

const fxEmbedRestBody = (url: string) => {
	const decodedUrl = decodeURIComponent(url)
	return JSON.stringify(
		decodedUrl.includes('/2/profile/') ?
			{
				code: 200,
				user: e2eFxEmbedUser,
			}
		:
		decodedUrl.includes('/2/search') ?
			{
				code: 200,
				results: [e2eFxEmbedStatus],
			}
		:
			{
				code: 200,
				status: e2eFxEmbedStatus,
				author: e2eFxEmbedUser,
			}
	)
}

const e2eYoutubeChannelId = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'
const e2eYoutubePlaylistId = 'UU_x5XG1OV2P6uZZ5FSM9Ttw'
const e2eYoutubeVideoId = 'jNQXAC9IVRw'
const e2eYoutubeCommentId = 'UgzuC3zzpRZkjc5Qzsd4AaABAg'

const youtubeRestWire = (url: string, method: string) => (
	method === 'GET'
	&& decodeURIComponent(url).includes('www.googleapis.com/youtube/v3/')
)

const e2eYoutubeChannel = {
	id: e2eYoutubeChannelId,
	snippet: {
		title: 'Blockhead YouTube E2E',
		description: 'YouTube channel fixture',
		publishedAt: '2024-01-01T00:00:00.000Z',
		customUrl: '@blockhead-e2e',
		thumbnails: {
			default: {
				url: 'https://example.com/youtube-channel.png',
			},
		},
	},
	statistics: {
		viewCount: '1000',
		subscriberCount: '100',
		videoCount: '1',
	},
}

const e2eYoutubeVideo = {
	id: e2eYoutubeVideoId,
	snippet: {
		title: 'Me at the zoo',
		description: 'YouTube video fixture',
		publishedAt: '2005-04-23T00:00:00.000Z',
		channelId: e2eYoutubeChannelId,
		channelTitle: 'Blockhead YouTube E2E',
		thumbnails: {
			default: {
				url: 'https://example.com/youtube-video.png',
			},
		},
	},
	statistics: {
		viewCount: '1000',
		likeCount: '100',
		commentCount: '1',
	},
	contentDetails: {
		duration: 'PT19S',
	},
}

const e2eYoutubePlaylist = {
	id: e2eYoutubePlaylistId,
	snippet: {
		title: 'Blockhead uploads',
		description: 'YouTube playlist fixture',
		publishedAt: '2024-01-01T00:00:00.000Z',
		channelId: e2eYoutubeChannelId,
		channelTitle: 'Blockhead YouTube E2E',
	},
	contentDetails: {
		itemCount: 1,
	},
}

const e2eYoutubeComment = {
	id: e2eYoutubeCommentId,
	snippet: {
		authorDisplayName: 'Blockhead commenter',
		videoId: e2eYoutubeVideoId,
		textDisplay: 'YouTube comment fixture',
		textOriginal: 'YouTube comment fixture',
		likeCount: 1,
		publishedAt: '2024-01-01T00:00:00.000Z',
		updatedAt: '2024-01-01T00:00:00.000Z',
	},
}

const youtubeRestBody = (url: string) => {
	const remoteUrl = new URL(decodeURIComponent(url).slice(decodeURIComponent(url).indexOf('https://www.googleapis.com/youtube/v3/')))
	return JSON.stringify(
		remoteUrl.pathname.endsWith('/channels') ?
			{
				items: [e2eYoutubeChannel],
			}
		:
		remoteUrl.pathname.endsWith('/videos') ?
			{
				items: [e2eYoutubeVideo],
			}
		:
		remoteUrl.pathname.endsWith('/playlists') ?
			{
				items: [e2eYoutubePlaylist],
			}
		:
		remoteUrl.pathname.endsWith('/playlistItems') ?
			{
				items: [
					{
						id: 'e2e-playlist-item',
						snippet: {
							...e2eYoutubeVideo.snippet,
							playlistId: e2eYoutubePlaylistId,
							position: 0,
							resourceId: {
								kind: 'youtube#video',
								videoId: e2eYoutubeVideoId,
							},
						},
						contentDetails: {
							videoId: e2eYoutubeVideoId,
							videoPublishedAt: '2005-04-23T00:00:00.000Z',
						},
					},
				],
			}
		:
		remoteUrl.pathname.endsWith('/commentThreads') ?
			{
				items: [
					{
						id: e2eYoutubeCommentId,
						snippet: {
							channelId: e2eYoutubeChannelId,
							videoId: e2eYoutubeVideoId,
							topLevelComment: e2eYoutubeComment,
						},
					},
				],
			}
		:
		remoteUrl.pathname.endsWith('/comments') ?
			{
				items: [e2eYoutubeComment],
			}
		:
			{
				items: [
					{
						id: {
							kind: 'youtube#video',
							videoId: e2eYoutubeVideoId,
							channelId: e2eYoutubeChannelId,
							playlistId: e2eYoutubePlaylistId,
						},
						snippet: e2eYoutubeVideo.snippet,
					},
				],
			}
	)
}

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
		if (rssRestWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/rss+xml; charset=utf-8',
				body: rssRestBody,
			})
			return
		}
		if (eip8004ScanRestWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: eip8004ScanRestBody(url),
			})
			return
		}
		if (fxEmbedRestWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: fxEmbedRestBody(url),
			})
			return
		}
		if (youtubeRestWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: youtubeRestBody(url),
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
		if (bitcoinCashNodeJsonRpcWire(url, method)) {
			const body = bitcoinCashNodeJsonRpcBody(route.request().postDataJSON())
			if (body != null) {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body,
				})
				return
			}
		}
		if (zcashdJsonRpcWire(url, method)) {
			const body = zcashdJsonRpcBody(route.request().postDataJSON())
			if (body != null) {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body,
				})
				return
			}
		}
		if (mempoolSpaceAddressWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: mempoolSpaceAddressBody,
			})
			return
		}
		if (mempoolSpaceTransactionWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: mempoolSpaceTransactionBody,
			})
			return
		}
		if (mempoolSpaceBlocksWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: mempoolSpaceBlocksBody,
			})
			return
		}
		if (mempoolSpaceMempoolStatsWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: mempoolSpaceMempoolStatsBody,
			})
			return
		}
		if (mempoolSpaceRecommendedFeesWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: mempoolSpaceRecommendedFeesBody,
			})
			return
		}
		if (blockchairBitcoinStatsWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: blockchairBitcoinStatsBody,
			})
			return
		}
		if (blockchairBitcoinAddressDashboardWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: blockchairBitcoinAddressDashboardBody,
			})
			return
		}
		if (blockchairBitcoinBlockDashboardWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: blockchairBitcoinBlockDashboardBody,
			})
			return
		}
		if (blockchairBitcoinBlocksWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: blockchairBitcoinBlocksBody,
			})
			return
		}
		if (blockchairBitcoinTransactionDashboardWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: blockchairBitcoinTransactionDashboardBody,
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
		if (beaconRestWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: beaconRestBody(url),
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
		if (substrateSidecarAccountBalanceInfoWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: MOCK_SUBSTRATE_SIDECAR_ACCOUNT_BALANCE_INFO_BODY,
			})
			return
		}
		if (substrateSidecarBlockWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: MOCK_SUBSTRATE_SIDECAR_BLOCK_BODY,
			})
			return
		}
		if (substrateSidecarRuntimeMetadataWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: MOCK_SUBSTRATE_SIDECAR_RUNTIME_METADATA_BODY,
			})
			return
		}
		if (subscanBlockWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: MOCK_SUBSCAN_BLOCK_BODY,
			})
			return
		}
		if (solanaJsonRpcWire(url, method)) {
			const body = solanaJsonRpcBody(route.request().postDataJSON())
			if (body != null) {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body,
				})
				return
			}
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
		if (coingeckoDerivativesExchangeWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: MOCK_COINGECKO_DERIVATIVES_EXCHANGE_BODY,
			})
			return
		}
		if (lightningLndRestInvoicesWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: MOCK_LIGHTNING_LND_INVOICES_BODY,
			})
			return
		}
		if (lightningLndRestGetInfoWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: MOCK_LIGHTNING_LND_GETINFO_BODY,
			})
			return
		}
		if (lightningLndRestChannelsWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: MOCK_LIGHTNING_LND_CHANNELS_BODY,
			})
			return
		}
		if (lightningLndRestPaymentsWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: MOCK_LIGHTNING_LND_PAYMENTS_BODY,
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
		if (mevRelayRestWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: mevRelayProposerPayloadDeliveredBody,
			})
			return
		}
		if (etherscanInternalTransactionsWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: etherscanInternalTransactionsBody,
			})
			return
		}
		if (blockscoutInternalTransactionsWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: blockscoutInternalTransactionsBody,
			})
			return
		}
		if (blockscoutTokenTransfersWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: blockscoutTokenTransfersBody,
			})
			return
		}
		if (blockscoutTokenAddressDetailsWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: blockscoutTokenAddressDetailsBody,
			})
			return
		}
		if (blockscoutTransactionLogsWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: blockscoutTransactionLogsBody,
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
					decodedUrl.includes('/v1/verificationsByFid') ?
						snapchainVerificationPageBody
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
		if (nostrBandRestWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: nostrBandRestBody(url),
			})
			return
		}
		if (primalRestWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: primalRestBody(
					url,
					method === 'POST' ? route.request().postDataJSON() : undefined
				),
			})
			return
		}
		if (activityPubRestWire(url, method)) {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: activityPubRestBody(url),
			})
			return
		}
			if (nostrRelayNip11Wire(url, method)) {
				await route.fulfill({
					status: 200,
					contentType: 'application/nostr+json',
					body: MOCK_NOSTR_RELAY_NIP11_BODY,
				})
				return
			}
			if (redditPublicJsonWire(url, method)) {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: redditPublicJsonBody(url),
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
		snapshot.failed.map((row) => `${formatBoundaryOwner(row)}: ${row.message}`)
		).toEqual([])
	expect(
		snapshot.loading.map((row) => `${formatBoundaryOwner(row)}: ${row.message}`)
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
