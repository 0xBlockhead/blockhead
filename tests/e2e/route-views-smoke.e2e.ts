import { test } from '@playwright/test'

import {
	expectMainVisible,
} from '../_e2eBrowserHelpers.ts'

import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from './_routeViewDiagnostics.ts'
import { routeViewSmokePathByLabel as pathByLabel } from './routeViewSmokePaths.ts'


const routeViewSmokeEntries = Object.entries(pathByLabel)
	.filter(([label, path]) => (
		(!process.env.E2E_ROUTE_VIEW_PATTERN || new RegExp(process.env.E2E_ROUTE_VIEW_PATTERN).test(path))
		&& (!process.env.E2E_ROUTE_VIEW_LABEL_PATTERN || new RegExp(process.env.E2E_ROUTE_VIEW_LABEL_PATTERN).test(label))
	))

if (
	(process.env.E2E_ROUTE_VIEW_PATTERN || process.env.E2E_ROUTE_VIEW_LABEL_PATTERN)
	&& routeViewSmokeEntries.length === 0
)
	throw new Error('No route view smoke rows matched E2E_ROUTE_VIEW_PATTERN / E2E_ROUTE_VIEW_LABEL_PATTERN')


/** Surfaces most `$/views/*` trees used from `src/routes`; each URL should render `#main` without console errors. Colocated `*.e2e.ts` cover deeper behavior. */
test.describe('route views smoke (#main, no page error)', () => {
	for (const [label, path] of routeViewSmokeEntries) {
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
