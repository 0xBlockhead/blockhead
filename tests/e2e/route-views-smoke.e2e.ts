import { test } from '@playwright/test'

import {
	expectMainVisible,
} from '../_e2eBrowserHelpers.ts'

import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from './_routeViewDiagnostics.ts'
import { routeViewSmokePathByLabel as pathByLabel } from './routeViewSmokePaths.ts'


/** Surfaces most `$/views/*` trees used from `src/routes`; each URL should render `#main` without console errors. Colocated `*.e2e.ts` cover deeper behavior. */
test.describe('route views smoke (#main, no page error)', () => {
	for (const [label, path] of Object.entries(pathByLabel)) {
		test(`${label}: ${path}`, async ({ page }, testInfo) => {
			testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
			const {
				diagnostics,
				flushArtifacts,
				step,
			} = setupRouteViewSmokePage(page)
			try {
				await step(page.goto(path, {
					waitUntil: 'domcontentloaded',
					timeout: routeViewSmokeTimeoutsMs.goto,
				}))
				await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
			}
			catch (e) {
				await flushArtifacts(testInfo)
				throw e
			}
		})
	}
})
