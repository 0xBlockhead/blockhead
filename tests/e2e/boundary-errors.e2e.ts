/**
 * After #main attaches, no `Boundary` / `QueryBoundary` failed branch may remain
 * (`[data-error]`). Loading placeholders are intentionally not asserted: many routes
 * keep list skeletons until resolvers finish (often beyond a single fixed budget).
 */
import { expect, test } from '@playwright/test'

import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from './_routeViewDiagnostics.ts'
import { routeViewSmokePathByLabel } from './routeViewSmokePaths.ts'


const settleTimeoutMs = routeViewSmokeTimeoutsMs.mainSelector


test.describe('boundary errors (#main, no [data-error])', () => {
	for (const [label, path] of Object.entries(routeViewSmokePathByLabel)) {
		test(`${label}: ${path}`, async ({ page }, testInfo) => {
			testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
			const { step, flushArtifacts } = setupRouteViewSmokePage(page)
			try {
				await step(page.goto(path, {
					waitUntil: 'domcontentloaded',
					timeout: routeViewSmokeTimeoutsMs.goto,
				}))
				await step(expect(page.locator('#main')).toBeAttached({
					timeout: routeViewSmokeTimeoutsMs.mainSelector,
				}))
				const main = page.locator('#main')
				await expect(main.locator('[data-error]')).toHaveCount(0, {
					timeout: settleTimeoutMs,
				})
			}
			catch (e) {
				await flushArtifacts(testInfo)
				throw e
			}
		})
	}
})
