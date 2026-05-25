/**
 * Serial crawl of every discovered `+page` route. Stops on the first runtime, boundary,
 * or resolver console failure so an agent can fix and re-run without waiting for the full matrix.
 *
 * ```
 * pnpm run test:e2e:failfast
 * E2E_PATH_LIMIT=20 pnpm run test:e2e:failfast
 * E2E_PROBE_PATH=/network/1 pnpm exec playwright test tests/e2e/route-errors-failfast.e2e.ts -g probe
 * E2E_START_PATH=/coins pnpm run test:e2e:failfast
 * ```
 */
import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	installChainlistRpcsJsonStub,
} from '../_e2eBrowserHelpers.ts'

import { discoverPathnamesFromRoutes } from './_routeDiscovery.ts'
import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from './_routeViewDiagnostics.ts'


const probePath = process.env.E2E_PROBE_PATH?.trim()
const startPath = process.env.E2E_START_PATH?.trim()

const selectPathnames = async () => {
	const all = await discoverPathnamesFromRoutes()
	const limitRaw = process.env.E2E_PATH_LIMIT ?? ''
	const limit = Number(limitRaw)
	let pageUrls = (
		limitRaw !== '' && Number.isFinite(limit) && limit > 0 ?
			all.slice(0, limit)
		:	all
	)
	if (startPath) {
		const index = pageUrls.indexOf(startPath)
		pageUrls = index === -1 ? pageUrls : pageUrls.slice(index)
	}
	return pageUrls
}

const isTransientDevLoadFailure = (message: string) => (
	message.includes('Failed to fetch dynamically imported module')
	|| message.includes('[vite] Failed to reload')
)

const visitRouteFailFast = async (
	page: import('@playwright/test').Page,
	testInfo: import('@playwright/test').TestInfo,
	pathname: string,
) => {
	const attemptVisit = async () => {
		const { step, flushArtifacts } = setupRouteViewSmokePage(page)
		try {
			await step(page.goto(pathname, {
				waitUntil: 'domcontentloaded',
				timeout: routeViewSmokeTimeoutsMs.goto,
			}))
			await step(expect(page.locator('#main')).toBeAttached({
				timeout: routeViewSmokeTimeoutsMs.mainSelector,
			}))
			const main = page.locator('#main')
			await step(expect(main.locator('[data-error]')).toHaveCount(0, {
				timeout: routeViewSmokeTimeoutsMs.mainSelector,
			}))
			await step(assertMainSettled(page, routeViewSmokeTimeoutsMs.mainSelector))
		}
		catch (e) {
			await flushArtifacts(testInfo)
			const message = e instanceof Error ? e.message : String(e)
			throw new Error(
				`route-errors-failfast stopped at ${pathname} (url=${page.url()}): ${message}`,
				{ cause: e },
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
		await installChainlistRpcsJsonStub(page)
		await visitRouteFailFast(page, testInfo, probePath!)
	})

	test('every +page URL until first failure', async ({ page }, testInfo) => {
		test.skip(probePath != null && probePath !== '', 'E2E_PROBE_PATH skips full matrix')
		const pageUrls = await selectPathnames()
		const perRouteBudgetMs = routeViewSmokeTimeoutsMs.test + 30_000
		testInfo.setTimeout(pageUrls.length * perRouteBudgetMs + 60_000)
		page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
		await installChainlistRpcsJsonStub(page)

		for (const pathname of pageUrls) {
			await test.step(pathname, async () => {
				await visitRouteFailFast(page, testInfo, pathname)
			})
		}
	})
})
