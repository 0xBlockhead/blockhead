/**
 * Dedicated gate for browser CORS console errors on every discovered `+page` route.
 * Other e2e suites ignore this noise; fix regressions via `$/lib/http.ts` (`corsFetch` / `getJson`)
 * and provider `origins` (`corsEnabled` + `/api-proxy` allow-list in `hooks.server.ts`).
 *
 * ```
 * pnpm run test:e2e:cors
 * E2E_PATH_LIMIT=20 pnpm run test:e2e:cors
 * E2E_PROBE_PATH=/network/eip155:1 pnpm exec playwright test tests/e2e/cors-policy.e2e.ts -g probe
 * ```
 */
import { expect, test, type Page, type TestInfo } from '@playwright/test'

import {
	assertMainSettled,
	collectBrowserCorsPolicyViolations,
	installChainlistRpcsJsonStub,
} from '../_e2eBrowserHelpers.ts'

import { discoverPathnamesFromRoutes } from './_routeDiscovery.ts'


const gotoLoadTimeoutMs = 120_000

const settleTimeoutMs = (() => {
	const raw = process.env.E2E_MAIN_MS?.trim()
	if (!raw) return 180_000
	const parsed = Number(raw)
	return Number.isFinite(parsed) ? parsed : 180_000
})()

const corsQuietMs = (() => {
	const raw = process.env.E2E_CORS_QUIET_MS?.trim()
	if (!raw) return 4_000
	const parsed = Number(raw)
	return Number.isFinite(parsed) ? parsed : 4_000
})()

const probePath = process.env.E2E_PROBE_PATH?.trim()

/** After `#main` + alerts settle, wait for in-flight resolver HTTP to finish (CORS logs often lag paint). */
const waitForPageFetchSettle = async (
	page: Page,
	violationCount: () => number,
) => {
	await assertMainSettled(page, settleTimeoutMs)

	await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {})

	const deadline = Date.now() + settleTimeoutMs
	let lastCount = violationCount()
	let quietSince = Date.now()

	while (Date.now() < deadline) {
		await page.waitForTimeout(250)
		const count = violationCount()
		if (count !== lastCount) {
			lastCount = count
			quietSince = Date.now()
			continue
		}
		if (Date.now() - quietSince >= corsQuietMs) return
	}
}

const assertNoCorsViolations = async (
	page: Page,
	violations: string[],
	path: string,
	testInfo: TestInfo,
) => {
	if (violations.length === 0) return

	const uniqueViolations = [...new Set(violations)]

	await testInfo.attach(`cors-violations-${path.replace(/\//g, '_') || 'root'}.txt`, {
		body: uniqueViolations.join('\n'),
		contentType: 'text/plain',
	})

	expect(
		uniqueViolations,
		`CORS policy violations on ${path}:\n${uniqueViolations.join('\n')}`,
	).toEqual([])
}

test.describe('cors policy (no blocked cross-origin fetches)', () => {
	test.describe.configure({ mode: 'serial' })

	test('probe route', async ({ page }, testInfo) => {
		test.skip(probePath == null || probePath === '', 'set E2E_PROBE_PATH')
		testInfo.setTimeout(settleTimeoutMs + gotoLoadTimeoutMs + 60_000)
		page.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
		await installChainlistRpcsJsonStub(page)
		const violations = collectBrowserCorsPolicyViolations(page)
		await page.goto(probePath!, {
			waitUntil: 'load',
			timeout: gotoLoadTimeoutMs,
		})
		await expect(page.locator('#main')).toBeVisible({ timeout: settleTimeoutMs })
		await waitForPageFetchSettle(page, () => violations.length)
		await assertNoCorsViolations(page, violations, probePath!, testInfo)
	})

	test('every +page URL', async ({ page }, testInfo) => {
		test.skip(probePath != null && probePath !== '', 'E2E_PROBE_PATH skips full matrix')
		testInfo.setTimeout(900_000)
		page.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
		await installChainlistRpcsJsonStub(page)

		const all = await discoverPathnamesFromRoutes()
		const limitRaw = process.env.E2E_PATH_LIMIT ?? ''
		const limit = Number(limitRaw)
		const pageUrls = (
			limitRaw !== '' && Number.isFinite(limit) && limit > 0 ?
				all.slice(0, limit)
			:	all
		)

		for (const path of pageUrls) {
			await test.step(path, async () => {
				const violations = collectBrowserCorsPolicyViolations(page)
				await page.goto(path, {
					waitUntil: 'load',
					timeout: gotoLoadTimeoutMs,
				})
				await expect(
					page.locator('#main'),
					`#main missing after goto ${path} (final URL: ${page.url()})`,
				).toBeVisible({ timeout: settleTimeoutMs })
				await waitForPageFetchSettle(page, () => violations.length)
				await assertNoCorsViolations(page, violations, path, testInfo)
			})
		}
	})
})
