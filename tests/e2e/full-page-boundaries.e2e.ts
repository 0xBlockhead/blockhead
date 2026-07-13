import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

import {
	assertCanonicalRouteUrl,
	expectMainVisible,
	formatBoundaryReportSummary,
	getBoundaryProbeEvents,
	installBoundaryProbe,
	installChainlistRpcsJsonStub,
	resetBoundaryProbe,
	summarizeRouteBoundaryReport,
	waitForBoundarySettle,
	type PageRuntimeDiagnostics,
	type RouteBoundaryReport,
} from '../_e2eBrowserHelpers.ts'

import { e2eBoundaryLiveOptionalPathnames } from './_routeParamFixtures.ts'
import {
	routeViewSmokePathByLabel,
} from './routeViewSmokePaths.ts'
import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from './_routeViewDiagnostics.ts'


const routeViewSmokeEntries = Object.entries(routeViewSmokePathByLabel)
	.filter(([label, pathname]) => (
		(!process.env.E2E_ROUTE_VIEW_PATTERN || new RegExp(process.env.E2E_ROUTE_VIEW_PATTERN).test(pathname))
		&& (!process.env.E2E_ROUTE_VIEW_LABEL_PATTERN || new RegExp(process.env.E2E_ROUTE_VIEW_LABEL_PATTERN).test(label))
	))

if (routeViewSmokeEntries.length === 0)
	throw new Error('No route view smoke rows matched E2E_ROUTE_VIEW_PATTERN / E2E_ROUTE_VIEW_LABEL_PATTERN')


const collectRouteBoundaryReport = async (
	page: Page,
	pathname: string,
	diagnostics: PageRuntimeDiagnostics
) => {
	await resetBoundaryProbe(page)
	await diagnostics.step(page.goto(pathname, {
		waitUntil: 'domcontentloaded',
		timeout: routeViewSmokeTimeoutsMs.goto,
	}))
	const main = page.locator('#main')
	await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
	await diagnostics.step(assertCanonicalRouteUrl(page, pathname))
	await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {})
	const mainVisible = await main.isVisible().catch(() => false)
	const snapshot = await waitForBoundarySettle(page, {
		timeoutMs: 8_000,
		quietMs: 1_000,
	})

	return summarizeRouteBoundaryReport(
		pathname,
		page.url(),
		mainVisible,
		await getBoundaryProbeEvents(page).catch(() => []),
		snapshot
	)
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


test.describe('full-page boundary failures (canonical smoke routes)', () => {
	test.describe.configure({ mode: 'serial' })

	for (const [label, pathname] of routeViewSmokeEntries) {
		test(`${label}: ${pathname}`, async ({ page }, testInfo) => {
			testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
			const {
				diagnostics,
				flushArtifacts,
				step,
			} = setupRouteViewSmokePage(page)
			await installBoundaryProbe(page)
			await installChainlistRpcsJsonStub(page)
			await installEthereumEipGithubStub(page)

			try {
				assertNoBrokenBoundaryReports([
					await step(collectRouteBoundaryReport(page, pathname, diagnostics)),
				])
			}
			catch (error) {
				await flushArtifacts(testInfo)
				throw error
			}
		})
	}
})
