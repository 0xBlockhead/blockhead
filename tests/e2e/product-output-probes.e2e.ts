/**
 * APP route probes must render product content after the normal route-settle gate.
 *
 * ```
 * ./node_modules/.bin/playwright test tests/e2e/product-output-probes.e2e.ts
 * ```
 */
import { expect, test } from '@playwright/test'

import { APP } from '../../APP.ts'

import {
	assertMainSettled,
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../_e2eBrowserHelpers.ts'

import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from './_routeViewDiagnostics.ts'


type ProbeManifest = {
	routes: {
		path: `/${string}`
	}[]
}

const probeManifest: ProbeManifest = APP.probes


test.describe('APP product output probes', () => {
	test.describe.configure({ mode: 'serial' })

	for (const probe of probeManifest.routes) {
		test(probe.path, async ({ page }, testInfo) => {
			testInfo.setTimeout(routeViewSmokeTimeoutsMs.test + 30_000)
			page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
			await installChainlistRpcsJsonStub(page)
			const {
				diagnostics,
				flushArtifacts,
				step,
			} = setupRouteViewSmokePage(page)

			try {
				const response = await step(page.goto(probe.path, {
					waitUntil: 'load',
					timeout: routeViewSmokeTimeoutsMs.goto,
				}))
				expect(response?.status(), `${probe.path} HTTP status`).toBeLessThan(400)
				await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
				await step(assertMainSettled(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics))
				expect(await page.locator('#main [data-error], #main [role="alert"]').count()).toBe(0)
				expect(await page.locator('#main .loading, #main [aria-busy="true"]').count()).toBe(0)
				expect(await page.locator('#main section, #main dl, #main ul, #main ol, #main [data-card], #main h1, #main h2, #main h3, #main table, #main pre, #main canvas').count()).toBeGreaterThan(1)
				expect(
					await page.locator('#main').evaluate((main) => main.textContent.replace(/\s+/g, ' ').trim())
				).toMatch(/[A-Za-z0-9][A-Za-z0-9].{80,}/)
			}
			catch (e) {
				await flushArtifacts(testInfo)
				throw e
			}
		})
	}
})
