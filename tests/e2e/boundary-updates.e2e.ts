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

const collectRouteBoundaryReport = async (
	page: import('@playwright/test').Page,
	pathname: string,
) => {
	await resetBoundaryProbe(page)
	for (let attempt = 1; attempt <= 3; attempt++) {
		try {
			await page.goto(pathname, {
				waitUntil: 'load',
				timeout: gotoLoadTimeoutMs,
			})
			break
		} catch (error) {
			if (attempt === 3)
				throw error

			await page.waitForTimeout(1_000 * attempt)
		}
	}

	const main = page.locator('#main')
	await main.waitFor({
		state: 'attached',
		timeout: settleTimeoutMs,
	}).catch(() => {})
	await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {})
	const mainVisible = await main.isVisible().catch(() => false)
	const snapshot = await waitForBoundarySettle(page, {
		timeoutMs: settleTimeoutMs,
		quietMs,
	})
	const updates = await getBoundaryProbeEvents(page).catch(() => [])

	return summarizeRouteBoundaryReport(
		pathname,
		page.url(),
		mainVisible,
		updates,
		snapshot,
	)
}

const attachBoundaryArtifacts = async (
	testInfo: import('@playwright/test').TestInfo,
	reports: RouteBoundaryReport[],
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
		formatBoundaryReportSummary(reports, e2eBoundaryLiveOptionalPathnames),
	).toEqual([])
}

const withRouteTimeout = async (
	pathname: string,
	index: number,
	total: number,
	collect: Promise<RouteBoundaryReport>,
) => {
	const timeoutMs = settleTimeoutMs + gotoLoadTimeoutMs + 60_000
	return Promise.race([
		collect,
		new Promise<never>((_, reject) => {
			setTimeout(() => {
				reject(new Error(
					`boundary route timeout after ${timeoutMs}ms at ${pathname} (${index + 1}/${total})`,
				))
			}, timeoutMs)
		}),
	])
}

test.describe('boundary updates (every +page route)', () => {
	test.describe.configure({ mode: 'serial' })

	test('probe route', async ({ page }, testInfo) => {
		test.skip(probePath == null || probePath === '', 'set E2E_PROBE_PATH')
		testInfo.setTimeout(settleTimeoutMs + gotoLoadTimeoutMs + 60_000)
		page.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
		await installBoundaryProbe(page)
		await installChainlistRpcsJsonStub(page)

		const report = await collectRouteBoundaryReport(page, probePath!)
		await attachBoundaryArtifacts(testInfo, [report])
		if (!reportOnly)
			assertBoundaryReports([report])
	})

	test('every +page URL', async ({ page }, testInfo) => {
		test.skip(probePath != null && probePath !== '', 'E2E_PROBE_PATH skips full matrix')
		page.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
		await installBoundaryProbe(page)
		await installChainlistRpcsJsonStub(page)

		const all = (
			(await discoverPathnamesFromRoutes())
				.filter((pathname) => pathPattern?.test(pathname) ?? true)
		)
		const limitRaw = process.env.E2E_PATH_LIMIT ?? ''
		const limit = Number(limitRaw)
			let pageUrls = (
				limitRaw !== '' && Number.isFinite(limit) && limit > 0 ?
					all.slice(0, limit)
				:
					all
			)
			if (startPath) {
				const index = pageUrls.indexOf(startPath)
				pageUrls = index === -1 ? pageUrls : pageUrls.slice(index)
			}

		const perRouteBudgetMs = settleTimeoutMs + gotoLoadTimeoutMs + 60_000
		testInfo.setTimeout(pageUrls.length * perRouteBudgetMs + 60_000)

		const reports: RouteBoundaryReport[] = []

			for (const [index, pathname] of pageUrls.entries()) {
				await test.step(pathname, async () => {
					console.log(`[boundary route] ${index + 1}/${pageUrls.length} ${pathname}`)
					reports.push(await withRouteTimeout(
						pathname,
						index,
						pageUrls.length,
						collectRouteBoundaryReport(page, pathname),
					))
				})
			}

		await attachBoundaryArtifacts(testInfo, reports)
		if (!reportOnly)
			assertBoundaryReports(reports)
	})
})
