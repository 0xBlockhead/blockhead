/**
 * Serial crawl of every discovered `+page` route. Stops on the first app-shell,
 * page-error, critical-console, or failed-settlement signal so an agent can fix and re-run without waiting for the full matrix.
 *
 * ```
 * pnpm run test:e2e:failfast
 * E2E_PATH_LIMIT=20 pnpm run test:e2e:failfast
 * E2E_PATH_PATTERN='^/network/eip155:1(/|$)' pnpm run test:e2e:failfast
 * E2E_PATH_SHARD_TOTAL=4 E2E_PATH_SHARD_INDEX=0 pnpm run test:e2e:failfast
 * E2E_PROBE_PATH=/network/eip155:1 pnpm exec playwright test tests/e2e/route-errors-failfast.e2e.ts -g probe
 * E2E_PROBE_PATH=/network/cosmos:cosmoshub-4 E2E_MAIN_MS=240000 E2E_TEST_MS=300000 pnpm exec playwright test tests/e2e/route-errors-failfast.e2e.ts -g probe
 * E2E_START_PATH=/coins pnpm run test:e2e:failfast
 * ```
 */
import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	assertCanonicalRouteUrl,
	assertNoGeneratedRouteArtifacts,
	e2eBrowserNewContextOptions,
	expectMainVisible,
	installBoundaryProbe,
	installChainlistRpcsJsonStub,
	pageFailureSnapshot,
} from '../_e2eBrowserHelpers.ts'

import { discoverFilteredPathnamesFromRoutes } from './_routeDiscovery.ts'
import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from './_routeViewDiagnostics.ts'


const probePath = process.env.E2E_PROBE_PATH?.trim()
const expectedVisibleText = process.env.E2E_EXPECT_VISIBLE_TEXT?.trim()

const selectPathnames = async () => {
	return discoverFilteredPathnamesFromRoutes()
}

const withRouteTimeout = async (
	pathname: string,
	index: number,
	total: number,
	visit: Promise<void>
) => {
	const timeoutMs = routeViewSmokeTimeoutsMs.test + 30_000
	await Promise.race([
		visit,
		new Promise<never>((_, reject) => {
			setTimeout(() => {
				reject(new Error(
					`route smoke timeout after ${timeoutMs}ms at ${pathname} (${index + 1}/${total})`
				))
			}, timeoutMs)
		}),
	])
}

const visitRouteFailFast = async (
	page: import('@playwright/test').Page,
	testInfo: import('@playwright/test').TestInfo,
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
			timeout: routeViewSmokeTimeoutsMs.goto,
		}))
		await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
		await step(assertCanonicalRouteUrl(page, pathname))
		const main = page.locator('#main')
		await step(expect(main.locator('[data-error]')).toHaveCount(0, {
			timeout: routeViewSmokeTimeoutsMs.mainSelector,
		}))
		await step(assertMainSettled(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics))
		if (expectedVisibleText != null && expectedVisibleText !== '')
			await step(expect(main).toContainText(expectedVisibleText))

		await step(assertNoGeneratedRouteArtifacts(page, pathname))
	}
	catch (e) {
		await flushArtifacts(testInfo)
		const message = e instanceof Error ? e.message : String(e)
		throw new Error(
			[
				`route-errors-failfast stopped at ${pathname} (url=${page.url()}): ${message}`,
				`section/resource/source ownership:\n${await pageFailureSnapshot(page)}`,
			].join('\n\n'),
			{ cause: e }
		)
	}
}

const installRouteProbeDatabase = async (
	page: import('@playwright/test').Page,
	databaseName: string
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
}

test.describe('route errors fail-fast (every +page, stop on first)', () => {
	test.describe.configure({ mode: 'serial' })

	test('probe route', async ({ browser }, testInfo) => {
		test.skip(probePath == null || probePath === '', 'set E2E_PROBE_PATH')
		testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
		const context = await browser.newContext(e2eBrowserNewContextOptions())
		const page = await context.newPage()
		page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
		try {
			await installBoundaryProbe(page)
			await installRouteProbeDatabase(
				page,
				`blockhead-route-errors-probe-${testInfo.workerIndex}-${testInfo.retry}-${testInfo.repeatEachIndex}-${Date.now()}.sqlite`
			)
			await installChainlistRpcsJsonStub(page)
			await visitRouteFailFast(page, testInfo, probePath!)
		} finally {
			await context.close()
		}
	})

	test('every +page URL until first failure', async ({ browser }, testInfo) => {
		test.skip(probePath != null && probePath !== '', 'E2E_PROBE_PATH skips full matrix')
		const pageUrls = await selectPathnames()
		const perRouteBudgetMs = routeViewSmokeTimeoutsMs.test + 30_000
		testInfo.setTimeout(pageUrls.length * perRouteBudgetMs + 60_000)
		console.log([
			`[route-errors-failfast] selected ${pageUrls.length} routes`,
			`pattern=${process.env.E2E_PATH_PATTERN?.trim() || '<unset>'}`,
			`start=${process.env.E2E_START_PATH?.trim() || '<unset>'}`,
			`limit=${process.env.E2E_PATH_LIMIT?.trim() || '<unset>'}`,
			`shard=${process.env.E2E_PATH_SHARD_INDEX?.trim() || '0'}/${process.env.E2E_PATH_SHARD_TOTAL?.trim() || '1'}`,
		].join(' '))

		for (const [index, pathname] of pageUrls.entries()) {
			console.log(`[route-errors-failfast] ${index + 1}/${pageUrls.length} ${pathname}`)
			await test.step(pathname, async () => {
				const context = await browser.newContext(e2eBrowserNewContextOptions())
				const page = await context.newPage()
				try {
					page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
					await installBoundaryProbe(page)
					await installRouteProbeDatabase(
						page,
						`blockhead-route-errors-${testInfo.workerIndex}-${testInfo.retry}-${testInfo.repeatEachIndex}-${index}-${Date.now()}.sqlite`
					)
					await installChainlistRpcsJsonStub(page)
					await withRouteTimeout(
						pathname,
						index,
						pageUrls.length,
						visitRouteFailFast(page, testInfo, pathname)
					)
				} finally {
					await context.close()
				}
			})
		}
	})
})
