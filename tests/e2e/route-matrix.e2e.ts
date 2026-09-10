/**
 * Canonical cross-route regression owner: shell (`#main`), canonical URL, settlement,
 * runtime diagnostics, and boundary failure. Fail-fast, probe, filtering, sharding,
 * and verbose artifacts are execution modes of this file, not separate claims.
 *
 * ```
 * pnpm run test:e2e:boundaries
 * E2E_PATH_LIMIT=20 pnpm run test:e2e:boundaries
 * E2E_PATH_PATTERN='^/(activitypub|atproto|farcaster|lens|nostr|reddit|rss|x|xmtp|youtube)(/|$)' pnpm run test:e2e:boundaries
 * E2E_FAILFAST=1 pnpm run test:e2e:failfast
 * E2E_PATH_SHARD_TOTAL=4 E2E_PATH_SHARD_INDEX=0 pnpm run test:e2e:failfast
 * E2E_PROBE_PATH=/network/eip155:1 pnpm exec playwright test tests/e2e/route-matrix.e2e.ts -g probe
 * E2E_PROBE_PATH=/network/cosmos:cosmoshub-4 E2E_MAIN_MS=240000 pnpm exec playwright test tests/e2e/route-matrix.e2e.ts -g probe
 * E2E_START_PATH=/coins pnpm run test:e2e:failfast
 * E2E_BOUNDARY_SLOW_MS=30000 pnpm run test:e2e:boundaries
 * ```
 */
import type { Page, TestInfo } from '@playwright/test'
import { expect, test } from '@playwright/test'

import {
	assertCanonicalRouteUrl,
	assertMainSettled,
	e2eBrowserNewContextOptions,
	expectMainVisible,
	formatBoundaryReportSummary,
	getBoundaryProbeEvents,
	installBoundaryProbe,
	installChainlistRpcsJsonStub,
	jsonStringifyForExpectMessage,
	pageFailureSnapshot,
	requestFailureIsResourceCancellation,
	resetBoundaryProbe,
	snapshotBoundaryMain,
	summarizeRouteBoundaryReport,
	waitForBoundarySettle,
	type RouteBoundaryReport,
} from '../_e2eBrowserHelpers.ts'

import { discoverFilteredPathnamesFromRoutes } from './_routeDiscovery.ts'
import { e2eBoundaryLiveOptionalPathnames } from './_routeParamFixtures.ts'
import { setupRouteViewSmokePage } from './_routeViewDiagnostics.ts'
import {
	assertRouteReportCoherent,
	corpusFingerprint,
	resultSetFingerprint,
	createRouteRunIdentity,
	routeCorpusTargetsFromPathnames,
	routeResultFromReport,
	type RouteMatrixArtifact,
	type RouteResult,
} from '../../scripts/e2e/routeRunIdentity.ts'


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
const failFast = process.env.E2E_FAILFAST === '1'
const expectedVisibleText = process.env.E2E_EXPECT_VISIBLE_TEXT?.trim()
const verboseArtifacts = process.env.E2E_MATRIX_ARTIFACTS !== '0'

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

const installRoutePageDiagnostics = (page: Page) => {
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

const installEthereumEipGithubStub = async (page: Page) => {
	await page.route(
		(url) => {
			const href = decodeURIComponent(url.href)
			return (
				href.includes('api.github.com/repos/ethereum/EIPs/contents/EIPS')
				|| (
					href.includes('raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-')
					&& href.endsWith('.md')
				)
			)
		},
		async (route) => {
			const href = decodeURIComponent(route.request().url())
			const proposalNumber = href.match(/eip-(\d+)\.md$/)?.[1] ?? '1559'
			await route.fulfill(
				href.includes('api.github.com/repos/ethereum/EIPs/contents/EIPS') ?
					{
						contentType: 'application/json',
						body: JSON.stringify([
							{
								type: 'file',
								name: 'eip-1.md',
							},
							{
								type: 'file',
								name: 'eip-1559.md',
							},
						]),
					}
				:
					{
						contentType: 'text/markdown',
						body: [
							'---',
							`eip: ${proposalNumber}`,
							`title: EIP ${proposalNumber}`,
							'status: Final',
							'category: Core',
							'---',
							'',
							`# EIP-${proposalNumber}`,
							'',
							'Deterministic E2E fixture body.',
						].join('\n'),
					}
			)
		}
	)
}

const installAtprotoGraphStub = async (page: Page) => {
	await page.route(
		(url) => {
			const href = decodeURIComponent(url.href)
			return (
				href.includes('app.bsky.graph.getList')
				|| href.includes('app.bsky.graph.getStarterPack')
				|| href.includes('app.bsky.actor.getProfile')
			)
		},
		async (route) => {
			const href = decodeURIComponent(route.request().url())
			if (href.includes('app.bsky.actor.getProfile')) {
				await route.fulfill({
					contentType: 'application/json',
					body: JSON.stringify({
						did: 'did:plc:journeyfixture',
						handle: 'journeyfixture.test',
						displayName: 'Journey Fixture',
						avatar: 'https://cdn.bsky.app/journey-fixture.png',
						indexedAt: '2026-08-21T00:00:00.000Z',
					}),
				})
				return
			}
			const uri = href.includes('app.bsky.graph.getStarterPack') ?
				'at://did:plc:journeyfixture/app.bsky.graph.starterpack/welcome'
			:
				'at://did:plc:journeyfixture/app.bsky.graph.list/team'
			if (href.includes('app.bsky.graph.getStarterPack')) {
				await route.fulfill({
					contentType: 'application/json',
					body: JSON.stringify({
						starterPack: {
							uri,
							cid: 'bafyreijourneystarterpack',
							creator: {
								did: 'did:plc:journeyfixture',
								handle: 'journeyfixture.test',
							},
							list: {
								uri: 'at://did:plc:journeyfixture/app.bsky.graph.list/team',
								cid: 'bafyreijourneylist',
								name: 'Journey Team',
								purpose: 'app.bsky.graph.defs#referencelist',
							},
							indexedAt: '2026-08-21T00:00:00.000Z',
						},
					}),
				})
				return
			}
			await route.fulfill({
				contentType: 'application/json',
				body: JSON.stringify({
					list: {
						uri,
						cid: 'bafyreijourneylist',
						creator: {
							did: 'did:plc:journeyfixture',
							handle: 'journeyfixture.test',
						},
						name: 'Journey Team',
						purpose: 'app.bsky.graph.defs#referencelist',
						indexedAt: '2026-08-21T00:00:00.000Z',
					},
					items: [],
				}),
			})
		}
	)
}

const installRouteMatrixPage = async (
	page: Page,
	databaseName: string,
	{
		logProxyFetchFailures = false,
	}: {
		logProxyFetchFailures?: boolean
	} = {}
) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: databaseName,
		schemaVersion: Date.now(),
	})
	if (logProxyFetchFailures)
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
	await installBoundaryProbe(page)
	await installChainlistRpcsJsonStub(page)
	await installEthereumEipGithubStub(page)
	await installAtprotoGraphStub(page)
}

const collectRouteBoundaryReport = async (
	page: Page,
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
	testInfo: TestInfo,
	reports: RouteBoundaryReport[]
) => {
	if (!verboseArtifacts) return

	const summary = formatBoundaryReportSummary(reports, e2eBoundaryLiveOptionalPathnames)
	console.log(`\n--- route matrix ---\n${summary}`)
	await testInfo.attach('route-matrix-summary.txt', {
		body: summary,
		contentType: 'text/plain',
	})
	await testInfo.attach('route-matrix-report.json', {
		body: JSON.stringify(await (async () => {
			const runIdentity = await routeRunIdentity
			const results: RouteResult[] = reports.map((report) => routeResultFromReport(report, routeCorpusTargets))
			const artifact = {
				runIdentity,
				corpusFingerprint: corpusFingerprint(routeCorpusTargets),
				resultSetFingerprint: resultSetFingerprint(results),
				reports: results,
			} satisfies RouteMatrixArtifact
			assertRouteReportCoherent({
				acceptedResults: results,
				corpusTargets: routeCorpusTargets,
				report: artifact,
				runIdentity,
				reportName: 'route-matrix-report.json',
			})
			return artifact
		})(), null, 2),
		contentType: 'application/json',
	})
}

const attachClientTraceArtifact = async (
	page: Page,
	testInfo: TestInfo,
	pathname: string,
	report: RouteBoundaryReport
) => {
	if (
		!verboseArtifacts
		|| report.issues.length === 0
	)
		return

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

const assertNoBrokenBoundaryReports = (
	reports: RouteBoundaryReport[]
) => {
	expect(
		reports
			.filter((report) => (
				report.issues.length > 0
				&& !e2eBoundaryLiveOptionalPathnames.has(report.pathname)
			))
			.map((report) => `${report.pathname}\n  ${report.issues.join('\n  ')}`),
		formatBoundaryReportSummary(reports, e2eBoundaryLiveOptionalPathnames)
	).toEqual([])
}

const assertCanonicalShell = async (
	page: Page,
	pathname: string
) => {
	await assertCanonicalRouteUrl(page, pathname)
	if (!e2eBoundaryLiveOptionalPathnames.has(pathname))
		await expect(page.locator('#main').locator('[data-error]')).toHaveCount(0)
	if (expectedVisibleText != null && expectedVisibleText !== '')
		await expect(page.locator('#main')).toContainText(expectedVisibleText)
}

const visitRouteMatrix = async (
	page: Page,
	testInfo: TestInfo,
	pathname: string
) => {
	const diagnostics = installRoutePageDiagnostics(page)
	const report = await collectRouteBoundaryReport(page, pathname, diagnostics)
	await attachClientTraceArtifact(page, testInfo, pathname, report)
	await attachBoundaryArtifacts(testInfo, [report])
	await assertCanonicalShell(page, pathname)
	assertNoBrokenBoundaryReports([report])
	return report
}

const visitRouteFailFast = async (
	page: Page,
	testInfo: TestInfo,
	pathname: string
) => {
	const {
		diagnostics,
		flushArtifacts,
		step,
	} = setupRouteViewSmokePage(page)
	try {
		await step(page.goto(pathname, {
			waitUntil: 'load',
			timeout: gotoLoadTimeoutMs,
		}))
		await expectMainVisible(page, settleTimeoutMs, diagnostics)
		await step(assertCanonicalRouteUrl(page, pathname))
		await step(expect(page.locator('#main').locator('[data-error]')).toHaveCount(0, {
			timeout: settleTimeoutMs,
		}))
		await step(assertMainSettled(page, settleTimeoutMs, diagnostics))
		if (expectedVisibleText != null && expectedVisibleText !== '')
			await step(expect(page.locator('#main')).toContainText(expectedVisibleText))
	}
	catch (error) {
		await flushArtifacts(testInfo)
		const message = error instanceof Error ? error.message : String(error)
		throw new Error(
			[
				`route-matrix fail-fast stopped at ${pathname} (url=${page.url()}): ${message}`,
				`section/resource/source ownership:\n${await pageFailureSnapshot(page)}`,
			].join('\n\n'),
			{ cause: error }
		)
	}
}

const withRouteTimeout = async (
	pathname: string,
	index: number,
	total: number,
	visit: Promise<void>,
	onTimeout: () => Promise<void>
) => {
	const timeoutMs = settleTimeoutMs + gotoLoadTimeoutMs + 30_000
	await Promise.race([
		visit,
		new Promise<never>((_, reject) => {
			setTimeout(async () => {
				await onTimeout()
				reject(new Error(
					`route matrix timeout after ${timeoutMs}ms at ${pathname} (${index + 1}/${total})`
				))
			}, timeoutMs)
		}),
	])
}

const routeDatabaseName = (
	prefix: string,
	testInfo: TestInfo,
	index?: number
) => (
	`blockhead-${prefix}-${testInfo.workerIndex}-${testInfo.retry}-${testInfo.repeatEachIndex}${index == null ? '' : `-${index}`}-${Date.now()}.sqlite`
)

const {
	routePathnames,
	routeDiscoveryError,
} = await (async () => {
	if (
		(probePath != null && probePath !== '')
		|| failFast
	)
		return {
			routePathnames: probePath != null && probePath !== '' ? [probePath] : [],
			routeDiscoveryError: undefined,
		}

	try {
		return {
			routePathnames: await discoverFilteredPathnamesFromRoutes(),
			routeDiscoveryError: undefined,
		}
	} catch (error) {
		// Keep probe/contract tests loadable when generated route atoms lag `_routeParamFixtures`.
		const routePathnames: string[] = []
		return {
			routePathnames,
			routeDiscoveryError: error,
		}
	}
})()

const routeCorpusTargets = routeCorpusTargetsFromPathnames(
	routePathnames.length > 0 ? routePathnames : probePath ? [probePath] : []
)
const routeRunIdentity = createRouteRunIdentity({
	repositoryDirectory: process.cwd(),
	browserIdentity: process.env.E2E_BROWSER_IDENTITY?.trim() || 'playwright',
	buildIdentity: process.env.E2E_BUILD_IDENTITY?.trim() || 'route-matrix',
	captureContractVersion: process.env.E2E_CAPTURE_CONTRACT_VERSION?.trim() || 'route-matrix-v1',
	classifierVersion: process.env.E2E_CLASSIFIER_VERSION?.trim() || 'boundary-v1',
	corpusVersion: process.env.E2E_CORPUS_VERSION?.trim() || 'discovered-pathnames-v1',
})

test.describe('route matrix (shell, URL, settlement, diagnostics, boundary)', () => {
	test.describe.configure({
		mode: failFast ?
			'serial'
		:
			'parallel',
	})

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
		const pathname = probePath
		test.skip(pathname == null || pathname === '', 'set E2E_PROBE_PATH')
		if (pathname == null || pathname === '')
			return

		testInfo.setTimeout(settleTimeoutMs + gotoLoadTimeoutMs + 60_000)
		page.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
		await installRouteMatrixPage(
			page,
			routeDatabaseName('route-matrix-probe', testInfo),
			{
				logProxyFetchFailures: !failFast,
			}
		)
		if (failFast)
			await visitRouteFailFast(page, testInfo, pathname)
		else
			await visitRouteMatrix(page, testInfo, pathname)
	})

	test('every +page URL until first failure', async ({ browser }, testInfo) => {
		test.skip(!failFast, 'set E2E_FAILFAST=1')
		test.skip(probePath != null && probePath !== '', 'E2E_PROBE_PATH skips full matrix')
		const pageUrls = await discoverFilteredPathnamesFromRoutes()
		const perRouteBudgetMs = settleTimeoutMs + gotoLoadTimeoutMs + 30_000
		testInfo.setTimeout(pageUrls.length * perRouteBudgetMs + 60_000)
		console.log([
			`[route-matrix fail-fast] selected ${pageUrls.length} routes`,
			`pattern=${process.env.E2E_PATH_PATTERN?.trim() || '<unset>'}`,
			`start=${process.env.E2E_START_PATH?.trim() || '<unset>'}`,
			`limit=${process.env.E2E_PATH_LIMIT?.trim() || '<unset>'}`,
			`shard=${process.env.E2E_PATH_SHARD_INDEX?.trim() || '0'}/${process.env.E2E_PATH_SHARD_TOTAL?.trim() || '1'}`,
		].join(' '))

		for (const [index, pathname] of pageUrls.entries()) {
			console.log(`[route-matrix fail-fast] ${index + 1}/${pageUrls.length} ${pathname}`)
			await test.step(pathname, async () => {
				const context = await browser.newContext(e2eBrowserNewContextOptions())
				const page = await context.newPage()
				try {
					page.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
					await installRouteMatrixPage(
						page,
						routeDatabaseName('route-matrix-failfast', testInfo, index)
					)
					await withRouteTimeout(
						pathname,
						index,
						pageUrls.length,
						visitRouteFailFast(page, testInfo, pathname),
						async () => {
							const snapshot = await pageFailureSnapshot(page)
							await testInfo.attach('route-timeout-evidence.txt', {
								body: [
									`pathname: ${pathname}`,
									`url: ${page.url()}`,
									'section/resource/source ownership:',
									snapshot,
								].join('\n'),
								contentType: 'text/plain',
							})
						}
					)
				} finally {
					await context.close()
				}
			})
		}
	})

	for (const [index, pathname] of routePathnames.entries()) {
		test(`${index + 1}/${routePathnames.length} ${pathname}`, async ({ page }, testInfo) => {
			testInfo.setTimeout(settleTimeoutMs + gotoLoadTimeoutMs + 60_000)
			page.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
			await installRouteMatrixPage(
				page,
				routeDatabaseName('route-matrix', testInfo, index),
				{
					logProxyFetchFailures: true,
				}
			)
			console.log(`[route matrix] ${index + 1}/${routePathnames.length} ${pathname}`)
			await visitRouteMatrix(page, testInfo, pathname)
		})
	}

	test('route discovery produced matrix cases', () => {
		test.skip(failFast, 'E2E_FAILFAST skips per-route matrix')
		test.skip(probePath != null && probePath !== '', 'E2E_PROBE_PATH skips full matrix')
		if (routeDiscoveryError instanceof Error)
			throw routeDiscoveryError
		if (routeDiscoveryError != null)
			throw new Error(String(routeDiscoveryError))
		expect(routePathnames.length).toBeGreaterThan(0)
	})
})
