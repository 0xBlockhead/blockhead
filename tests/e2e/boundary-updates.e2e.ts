/**
 * Visits every discovered `+page` route, records QueryBoundary / ResourceBoundary /
 * svelte:boundary updates, and reports routes whose boundaries failed, stayed loading,
 * or left `#main` empty after settle.
 *
 * ```
 * pnpm run test:e2e:boundaries
 * E2E_PATH_LIMIT=20 pnpm run test:e2e:boundaries
 * E2E_PATH_PATTERN='^/(activitypub|atproto|farcaster|lens|nostr|reddit|rss|x|xmtp|youtube)(/|$)' pnpm exec playwright test tests/e2e/boundary-updates.e2e.ts
 * E2E_PROBE_PATH=/network/eip155:1 pnpm exec playwright test tests/e2e/boundary-updates.e2e.ts -g probe
 * E2E_BOUNDARY_SLOW_MS=30000 pnpm run test:e2e:boundaries
 * ```
 */
import { expect, test } from '@playwright/test'

import {
	formatBoundaryReportSummary,
	getBoundaryProbeEvents,
	installBoundaryProbe,
	installChainlistRpcsJsonStub,
	jsonStringifyForExpectMessage,
	requestFailureIsResourceCancellation,
	resetBoundaryProbe,
	snapshotBoundaryMain,
	type RouteBoundaryReport,
	summarizeRouteBoundaryReport,
	waitForBoundarySettle,
} from '../_e2eBrowserHelpers.ts'

import { discoverFilteredPathnamesFromRoutes } from './_routeDiscovery.ts'


const gotoLoadTimeoutMs = 120_000

const settleTimeoutMs = (() => {
	const raw = process.env.E2E_BOUNDARY_SETTLE_MS?.trim()
		?? process.env.E2E_MAIN_MS?.trim()
	if (!raw) return 180_000
	const parsed = Number(raw)
	return Number.isFinite(parsed) ? parsed : 180_000
})()

const quietMs = (() => {
	const raw = process.env.E2E_BOUNDARY_QUIET_MS?.trim()
	if (!raw) return 4_000
	const parsed = Number(raw)
	return Number.isFinite(parsed) ? parsed : 4_000
})()

const slowThresholdMs = (() => {
	const raw = process.env.E2E_BOUNDARY_SLOW_MS?.trim()
	if (!raw) return 30_000
	const parsed = Number(raw)
	return Number.isFinite(parsed) ? parsed : 30_000
})()

const probePath = process.env.E2E_PROBE_PATH?.trim()

type RoutePageDiagnostics = NonNullable<RouteBoundaryReport['diagnostics']> & {
	flush: () => Promise<void>
}

/** Chromium cancels same-origin Vite module loads when a dev navigation replaces the document. */
const requestFailureIsViteNavigationModuleAbort = (
	url: string,
	frameUrl: string,
	failure: string | null
) => {
	const requestUrl = new URL(url)
	return (
		failure === 'net::ERR_ABORTED'
		&& requestUrl.origin === new URL(frameUrl).origin
		&& (
			requestUrl.pathname.startsWith('/src/')
			|| requestUrl.pathname.startsWith('/node_modules/')
			|| requestUrl.pathname.startsWith('/.svelte-kit/')
			|| requestUrl.pathname.startsWith('/@id/virtual:')
		)
	)
}

const installRoutePageDiagnostics = (page: import('@playwright/test').Page) => {
	const pendingConsoleReads: Promise<void>[] = []
	const diagnostics: RoutePageDiagnostics = {
		console: [],
		pageErrors: [],
		badResponses: [],
		requestFailures: [],
		lifecycle: [],
		flush: async () => {
			await Promise.all(pendingConsoleReads)
		},
	}

	page.on('console', (message) => {
		if (
			message.type() === 'error'
			|| message.type() === 'warning'
		)
			pendingConsoleReads.push(
				Promise.all(
					message.args().map(async (argument) => (
						await argument.jsonValue().catch(() => undefined)
					))
				).then((values) => {
					diagnostics.console.push({
						type: message.type(),
						text: values.length > 0 ?
							`${message.text()} ${jsonStringifyForExpectMessage(values)}`
						:
							message.text(),
					})
				})
			)
	})

	page.on('pageerror', (error) => {
		diagnostics.pageErrors.push({
			message: error.message,
			stack: error.stack,
		})
	})

	page.on('response', (response) => {
		if (response.status() >= 400) {
			const request = response.request()
			diagnostics.badResponses.push({
				status: response.status(),
				url: response.url(),
				method: request.method(),
				resourceType: request.resourceType(),
				frameUrl: request.frame().url(),
			})
		}
	})

	page.on('requestfailed', (request) => {
		const failure = request.failure()?.errorText ?? null
		if (requestFailureIsResourceCancellation(request.resourceType(), failure))
			return

		if (requestFailureIsViteNavigationModuleAbort(
			request.url(),
			request.frame().url(),
			failure
		))
			return

		diagnostics.requestFailures.push({
			url: request.url(),
			method: request.method(),
			failure,
			resourceType: request.resourceType(),
			frameUrl: request.frame().url(),
		})
	})

	page.on('close', () => {
		diagnostics.lifecycle.push({
			event: 'closed',
			at: Date.now(),
		})
	})

	page.on('crash', () => {
		diagnostics.lifecycle.push({
			event: 'crashed',
			at: Date.now(),
		})
	})

	return diagnostics
}

const collectRouteBoundaryReport = async (
	page: import('@playwright/test').Page,
	pathname: string,
	diagnostics: RoutePageDiagnostics
) => {
	const startedAt = Date.now()
	let navigationAt = startedAt
	let mainAttachedAt = startedAt
	let networkIdleAt = startedAt
	let settleAt = startedAt
	await resetBoundaryProbe(page)
	for (let attempt = 1; attempt <= 3; attempt++) {
		try {
			await page.goto(pathname, {
				waitUntil: 'load',
				timeout: gotoLoadTimeoutMs,
			})
			navigationAt = Date.now()
			break
		} catch (error) {
			if (attempt === 3) {
				diagnostics.pageErrors.push({
					message: error instanceof Error ? error.message : String(error),
					stack: error instanceof Error ? error.stack : undefined,
				})
				diagnostics.lifecycle.push({
					event: 'navigation-failed',
					at: Date.now(),
				})
				break
			}

			await page.waitForTimeout(1_000 * attempt)
		}
	}

	const main = page.locator('#main')
	const mainAttached = await main.waitFor({
		state: 'attached',
		timeout: settleTimeoutMs,
	}).then(
		() => true,
		(error) => {
			diagnostics.pageErrors.push({
				message: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : undefined,
			})
			diagnostics.lifecycle.push({
				event: 'main-not-attached',
				at: Date.now(),
			})
			return false
		}
	)
	mainAttachedAt = Date.now()
	if (mainAttached)
		await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch((error) => {
			diagnostics.lifecycle.push({
				event: 'networkidle-timeout',
				at: Date.now(),
			})
			diagnostics.pageErrors.push({
				message: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : undefined,
			})
		})
	networkIdleAt = Date.now()
	const mainVisible = await main.isVisible().catch(() => false)
	const snapshot = await waitForBoundarySettle(page, {
		timeoutMs: settleTimeoutMs,
		quietMs,
	})
	settleAt = Date.now()
	const updates = await getBoundaryProbeEvents(page).catch(() => [])
	await diagnostics.flush()
	const finishedAt = Date.now()

	return summarizeRouteBoundaryReport(
		pathname,
		page.url(),
		mainVisible,
		updates,
		snapshot,
		diagnostics,
		{
			navigationMs: navigationAt - startedAt,
			mainAttachedMs: mainAttachedAt - navigationAt,
			networkIdleMs: networkIdleAt - mainAttachedAt,
			settleMs: settleAt - networkIdleAt,
			eventsMs: finishedAt - settleAt,
			totalMs: finishedAt - startedAt,
		},
		slowThresholdMs
	)
}

const attachBoundaryArtifacts = async (
	testInfo: import('@playwright/test').TestInfo,
	reports: RouteBoundaryReport[]
) => {
	const summary = formatBoundaryReportSummary(reports)
	console.log(`\n--- boundary updates ---\n${summary}`)

	await testInfo.attach('boundary-updates-summary.txt', {
		body: summary,
		contentType: 'text/plain',
	})
	await testInfo.attach('boundary-updates-report.json', {
		body: JSON.stringify(reports, null, 2),
		contentType: 'application/json',
	})
}

const attachClientTraceArtifact = async (
	page: import('@playwright/test').Page,
	testInfo: import('@playwright/test').TestInfo,
	pathname: string,
	report: RouteBoundaryReport
) => {
	if (report.issues.length === 0) return

	const trace = await page.evaluate(() => {
		const collections = window.__blockheadClientProbe?.traceCollections()
		const rowCountsByCollection = (rowsByEntityType: Record<string, { readonly length: number }>) => (
			Object.fromEntries(
				Object.entries(rowsByEntityType)
					.filter(([, rows]) => rows.length > 0)
					.map(([collectionName, rows]) => [
						collectionName,
						rows.length,
					])
			)
		)
		const nestedRowCountsByCollection = (rowsByEntityTypeAndFieldName: Record<string, Record<string, { readonly length: number }>>) => (
			Object.fromEntries(
				Object.entries(rowsByEntityTypeAndFieldName)
					.map(([entityType, rowsByFieldName]) => [
						entityType,
						rowCountsByCollection(rowsByFieldName),
					])
					.filter(([, rowCounts]) => Object.keys(rowCounts).length > 0)
			)
		)
		const loadCountByCollection = (
			Object.groupBy(
				collections?.collectionLoads ?? [],
				(event) => `${event.collectionId}:${event.decision ?? 'unknown'}:${event.status ?? 'unknown'}`
			)
		)
		return {
			probeEnabled: window.__blockheadClientProbeEnabled === true,
			probeInstalled: window.__blockheadClientProbe != null,
			loadCounts: Object.fromEntries(
				Object.entries(loadCountByCollection).map(([key, events]) => [
					key,
					events.length,
				])
			),
			recentLoads: collections?.collectionLoads.slice(-40).map((event) => ({
				collectionId: event.collectionId,
				decision: event.decision,
				status: event.status,
				rowCount: event.rowCount,
				sourceRowCounts: event.sourceRowCounts,
				reason: event.reason,
				error: event.error,
			})) ?? [],
			rowCounts: {
				entities: rowCountsByCollection(collections?.collectionRows.entities ?? {}),
				fields: nestedRowCountsByCollection(collections?.collectionRows.fields ?? {}),
				counts: nestedRowCountsByCollection(collections?.collectionRows.counts ?? {}),
			},
		}
	})
	console.log(`[client trace] ${pathname} ${JSON.stringify(trace, null, 2)}`)
	await testInfo.attach(`client-trace-${pathname.replace(/\//g, '_') || 'root'}.json`, {
		body: JSON.stringify(trace, null, 2),
		contentType: 'application/json',
	})
}

const assertBoundaryReports = (reports: RouteBoundaryReport[]) => {
	const issueRoutes = reports.filter((report) => report.issues.length > 0)
	expect(
		issueRoutes.map((report) => (
			`${report.pathname}\n  ${report.issues.join('\n  ')}`
		)),
		formatBoundaryReportSummary(reports)
	).toEqual([])
}

const routePathnames = await (async () => {
	if (probePath != null && probePath !== '')
		return []

	return discoverFilteredPathnamesFromRoutes()
})()

test.describe('boundary updates (every +page route)', () => {
	test.describe.configure({ mode: 'parallel' })

	test('boundary snapshot identifies section, heading, and entity field owner', async ({ page }) => {
		await page.setContent(`
			<main id="main">
				<section
					id="network-transactions"
					data-scroll-marker-label="Transactions"
					data-entity-field-type="Network"
					data-entity-field-name="$$transactions"
				>
					<h2>Latest transactions</h2>
					<dl>
						<div>
							<dt>Transactions</dt>
							<dd><span class="loading" aria-busy="true" aria-label="Loading…">•••</span></dd>
						</div>
					</dl>
				</section>
			</main>
		`)

		expect((await snapshotBoundaryMain(page)).loading).toEqual([
			expect.objectContaining({
				context: expect.stringMatching(
					/field=Transactions.*resource=Network\.\$\$transactions.*section=Transactions.*id=#network-transactions.*heading=Latest transactions/
				),
			}),
		])
	})

	test('diagnostic ownership stays fail-closed with source error context', () => {
		const report = summarizeRouteBoundaryReport(
			'/network/eip155:1',
			'http://127.0.0.1:5173/network/eip155:1',
			true,
			[],
			{
				failed: [],
				loading: [{
					key: null,
					state: 'loading',
					message: 'Loading…',
					context: 'section=Transactions > resource=Network.$$transactions > heading=Latest transactions',
				}],
				empty: false,
				emptyReason: null,
				textLength: 24,
				contentMarkerCount: 1,
			},
			{
				console: [{
					type: 'error',
					text: 'Source.Voltaire_JsonRpc resolver Network.$$transactions failed',
				}],
				pageErrors: [],
				badResponses: [],
				requestFailures: [],
				lifecycle: [],
			}
		)

		expect(report.issues).toEqual([
			'still-loading:section=Transactions > resource=Network.$$transactions > heading=Latest transactions:Loading…',
			'console-error:Source.Voltaire_JsonRpc resolver Network.$$transactions failed',
		])
		expect(report.issues.join('\n')).not.toContain('unknown')
	})

	test('probe route', async ({ page }, testInfo) => {
		test.skip(probePath == null || probePath === '', 'set E2E_PROBE_PATH')
		testInfo.setTimeout(settleTimeoutMs + gotoLoadTimeoutMs + 60_000)
		page.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
		await page.addInitScript(({ databaseName, schemaVersion }) => {
			window.__blockheadClientProbeEnabled = true
			window.__blockheadWaSqliteDatabaseNameOverride = databaseName
			window.__blockheadWaSqliteVfsNameOverride = databaseName.replace(/[^a-zA-Z0-9_-]/g, '_')
			window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
		}, {
			databaseName: `blockhead-boundary-probe-${testInfo.workerIndex}-${testInfo.retry}-${testInfo.repeatEachIndex}-${Date.now()}.sqlite`,
			schemaVersion: Date.now(),
		})
		await page.addInitScript(() => {
			const originalFetch = window.fetch.bind(window)
			window.fetch = async (...parameters) => {
				const stack = new Error().stack
				const response = await originalFetch(...parameters)
				const url = response.url || String(parameters[0])
				if (
					response.status >= 400
					&& url.includes('/api-proxy/')
				)
					console.error('[blockhead:fetch-failed]', response.status, url, stack)
				return response
			}
		})
		const diagnostics = installRoutePageDiagnostics(page)
		await installBoundaryProbe(page)
		await installChainlistRpcsJsonStub(page)

		const report = await collectRouteBoundaryReport(page, probePath!, diagnostics)
		await attachClientTraceArtifact(page, testInfo, probePath!, report)
		await attachBoundaryArtifacts(testInfo, [report])
		assertBoundaryReports([report])
	})

	for (const [index, pathname] of routePathnames.entries()) {
		test(`${index + 1}/${routePathnames.length} ${pathname}`, async ({ page }, testInfo) => {
			test.skip(probePath != null && probePath !== '', 'E2E_PROBE_PATH skips full matrix')
			testInfo.setTimeout(settleTimeoutMs + gotoLoadTimeoutMs + 60_000)
			page.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
			await page.addInitScript(({ databaseName, schemaVersion }) => {
				window.__blockheadClientProbeEnabled = true
				window.__blockheadWaSqliteDatabaseNameOverride = databaseName
				window.__blockheadWaSqliteVfsNameOverride = databaseName.replace(/[^a-zA-Z0-9_-]/g, '_')
				window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
			}, {
				databaseName: `blockhead-boundary-${testInfo.workerIndex}-${testInfo.retry}-${testInfo.repeatEachIndex}-${index}-${Date.now()}.sqlite`,
				schemaVersion: Date.now(),
			})
			await page.addInitScript(() => {
				const originalFetch = window.fetch.bind(window)
				window.fetch = async (...parameters) => {
					const stack = new Error().stack
					const response = await originalFetch(...parameters)
					const url = response.url || String(parameters[0])
					if (
						response.status >= 400
						&& url.includes('/api-proxy/')
					)
						console.error('[blockhead:fetch-failed]', response.status, url, stack)
					return response
				}
			})
			const diagnostics = installRoutePageDiagnostics(page)
			await installBoundaryProbe(page)
			await installChainlistRpcsJsonStub(page)

			console.log(`[boundary route] ${index + 1}/${routePathnames.length} ${pathname}`)
			const report = await collectRouteBoundaryReport(page, pathname, diagnostics)
			await attachClientTraceArtifact(page, testInfo, pathname, report)
			await attachBoundaryArtifacts(testInfo, [report])
			assertBoundaryReports([report])
		})
	}

	test('route discovery produced boundary cases', () => {
		test.skip(probePath != null && probePath !== '', 'E2E_PROBE_PATH skips full matrix')
		expect(routePathnames.length).toBeGreaterThan(0)
	})
})
