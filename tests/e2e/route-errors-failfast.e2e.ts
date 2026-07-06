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
 * E2E_START_PATH=/coins pnpm run test:e2e:failfast
 * ```
 */
import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	clearOriginOpfs,
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../_e2eBrowserHelpers.ts'

import { discoverFilteredPathnamesFromRoutes } from './_routeDiscovery.ts'
import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from './_routeViewDiagnostics.ts'


const probePath = process.env.E2E_PROBE_PATH?.trim()

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

const isTransientDevLoadFailure = (message: string) => (
	message.includes('Failed to fetch dynamically imported module')
	|| message.includes('[vite] Failed to reload')
	|| (
		message.includes('__sveltekit_dev')
		&& (
			message.includes('"mainCount":0')
			|| message.includes('no-main')
		)
	)
)

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
	const attemptVisit = async () => {
		try {
			await step(page.goto(pathname, {
				waitUntil: 'load',
				timeout: routeViewSmokeTimeoutsMs.goto,
			}))
			await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
			const main = page.locator('#main')
			await step(expect(main.locator('[data-error]')).toHaveCount(0, {
				timeout: routeViewSmokeTimeoutsMs.mainSelector,
			}))
			await step(assertMainSettled(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics))
		}
		catch (e) {
			await flushArtifacts(testInfo)
			const message = e instanceof Error ? e.message : String(e)
			throw new Error(
				`route-errors-failfast stopped at ${pathname} (url=${page.url()}): ${message}`,
				{ cause: e }
			)
		}
	}

	try {
		await attemptVisit()
	}
	catch (first) {
		const message = first instanceof Error ? first.message : String(first)
		if (!isTransientDevLoadFailure(message)) throw first
		await page.waitForTimeout(2_000)
		await attemptVisit()
	}
}

test.describe('route errors fail-fast (every +page, stop on first)', () => {
	test.describe.configure({ mode: 'serial' })

	test('probe route', async ({ page }, testInfo) => {
		test.skip(probePath == null || probePath === '', 'set E2E_PROBE_PATH')
		testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
		page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
		await page.goto('/')
		await clearOriginOpfs(page)
		await installChainlistRpcsJsonStub(page)
		await visitRouteFailFast(page, testInfo, probePath!)
	})

	test('every +page URL until first failure', async ({ browser }, testInfo) => {
		test.skip(probePath != null && probePath !== '', 'E2E_PROBE_PATH skips full matrix')
		const pageUrls = await selectPathnames()
		const perRouteBudgetMs = routeViewSmokeTimeoutsMs.test + 30_000
		testInfo.setTimeout(pageUrls.length * perRouteBudgetMs + 60_000)

		for (const [index, pathname] of pageUrls.entries()) {
			console.log(`[route-errors-failfast] ${index + 1}/${pageUrls.length} ${pathname}`)
			await test.step(pathname, async () => {
				const page = await browser.newPage()
				try {
					page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
					await page.goto('/')
					await clearOriginOpfs(page)
					await installChainlistRpcsJsonStub(page)
					await withRouteTimeout(
						pathname,
						index,
						pageUrls.length,
						visitRouteFailFast(page, testInfo, pathname)
					)
				} finally {
					await page.close()
				}
			})
		}
	})
})
