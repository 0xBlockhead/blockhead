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
 * E2E_BOUNDARY_REPORT_ONLY=1 pnpm run test:e2e:boundaries
 * ```
 */
import { expect, test } from '@playwright/test'

import {
	formatBoundaryReportSummary,
	getBoundaryProbeEvents,
	installBoundaryProbe,
	installChainlistRpcsJsonStub,
	resetBoundaryProbe,
	type RouteBoundaryReport,
	summarizeRouteBoundaryReport,
	waitForBoundarySettle,
} from '../_e2eBrowserHelpers.ts'

import { e2eBoundaryLiveOptionalPathnames } from './_routeParamFixtures.ts'
import { discoverPathnamesFromRoutes } from './_routeDiscovery.ts'


declare global {
	interface Window {
		__blockheadWaSqliteDatabaseNameOverride?: string
		__blockheadProductDataSchemaVersionOverride?: number
	}
}


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

const reportOnly = process.env.E2E_BOUNDARY_REPORT_ONLY === '1'
const probePath = process.env.E2E_PROBE_PATH?.trim()
const startPath = process.env.E2E_START_PATH?.trim()
const pathPattern = (
	((raw) => (
		raw == null || raw === '' ?
			undefined
		:
			new RegExp(raw)
	))(process.env.E2E_PATH_PATTERN?.trim())
)

type RoutePageDiagnostics = NonNullable<RouteBoundaryReport['diagnostics']> & {
	flush: () => Promise<void>
}

const requestFailureIsTransientDevModuleAbort = (
	url: string,
	failure: string | null
) => (
	failure === 'net::ERR_ABORTED'
	&& (
		url.includes('/src/')
		|| url.includes('/node_modules/')
		|| url.includes('/.svelte-kit/')
		|| url.includes('/@id/virtual:')
	)
)

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
							`${message.text()} ${JSON.stringify(values)}`
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
		if (requestFailureIsTransientDevModuleAbort(request.url(), failure))
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
	const summary = formatBoundaryReportSummary(reports, e2eBoundaryLiveOptionalPathnames)
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

const assertBoundaryReports = (reports: RouteBoundaryReport[]) => {
	const issueRoutes = reports.filter((report) => (
		report.issues.length > 0
		&& !e2eBoundaryLiveOptionalPathnames.has(report.pathname)
	))
	expect(
		issueRoutes.map((report) => (
			`${report.pathname}\n  ${report.issues.join('\n  ')}`
		)),
		formatBoundaryReportSummary(reports, e2eBoundaryLiveOptionalPathnames)
	).toEqual([])
}

const routePathnames = await (async () => {
	if (probePath != null && probePath !== '')
		return []

	const all = (
		(await discoverPathnamesFromRoutes())
			.filter((pathname) => pathPattern?.test(pathname) ?? true)
	)
	const limitRaw = process.env.E2E_PATH_LIMIT ?? ''
	const limit = Number(limitRaw)
	let pathnames = (
		limitRaw !== '' && Number.isFinite(limit) && limit > 0 ?
			all.slice(0, limit)
		:
			all
	)
	if (startPath) {
		const index = pathnames.indexOf(startPath)
		pathnames = index === -1 ? pathnames : pathnames.slice(index)
	}
	return pathnames
})()

test.describe('boundary updates (every +page route)', () => {
	test.describe.configure({ mode: 'parallel' })

	test('probe route', async ({ page }, testInfo) => {
		test.skip(probePath == null || probePath === '', 'set E2E_PROBE_PATH')
		testInfo.setTimeout(settleTimeoutMs + gotoLoadTimeoutMs + 60_000)
		page.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
		await page.addInitScript(({ databaseName, schemaVersion }) => {
			window.__blockheadWaSqliteDatabaseNameOverride = databaseName
			window.__blockheadProductDataSchemaVersionOverride = schemaVersion
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
		await attachBoundaryArtifacts(testInfo, [report])
		if (!reportOnly)
			assertBoundaryReports([report])
	})

	for (const [index, pathname] of routePathnames.entries()) {
		test(`${index + 1}/${routePathnames.length} ${pathname}`, async ({ page }, testInfo) => {
			test.skip(probePath != null && probePath !== '', 'E2E_PROBE_PATH skips full matrix')
			testInfo.setTimeout(settleTimeoutMs + gotoLoadTimeoutMs + 60_000)
			page.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
			await page.addInitScript(({ databaseName, schemaVersion }) => {
				window.__blockheadWaSqliteDatabaseNameOverride = databaseName
				window.__blockheadProductDataSchemaVersionOverride = schemaVersion
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
			await attachBoundaryArtifacts(testInfo, [report])
			if (!reportOnly)
				assertBoundaryReports([report])
		})
	}

	test('route discovery produced boundary cases', () => {
		test.skip(probePath != null && probePath !== '', 'E2E_PROBE_PATH skips full matrix')
		expect(routePathnames.length).toBeGreaterThan(0)
	})
})
