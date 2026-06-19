/**
 * Single-route mount probe for tracing hangs / console noise without running the full smoke matrix.
 *
 * ```
 * E2E_PROBE_PATH=/coins/prices pnpm exec playwright test tests/e2e/route-view-mount-probe.e2e.ts
 * E2E_MAIN_MS=120000 E2E_TEST_MS=140000 pnpm exec playwright test tests/e2e/route-view-mount-probe.e2e.ts
 * ```
 */
import { test } from '@playwright/test'

import {
	expectMainVisible,
} from '../_e2eBrowserHelpers.ts'

import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from './_routeViewDiagnostics.ts'


const probePath = (
	process.env.E2E_PROBE_PATH?.trim()
	|| '/coins/prices'
)


test.describe.configure({ mode: 'serial' })

test(`probe ${probePath}`, async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
	const {
		diagnostics,
		flushArtifacts,
		step,
	} = setupRouteViewSmokePage(page)
	try {
		await step(page.goto(probePath, {
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
