/**
 * Dedicated gate for browser CORS console errors on every discovered `+page` route.
 * Other e2e suites ignore this noise; fix regressions via `$/lib/http.ts` (`corsFetch` / `getJson`)
 * and provider `origins` (`corsEnabled` + `/api-proxy` allow-list in `hooks.server.ts`).
 *
 * ```
 * pnpm run test:e2e:cors
 * E2E_PATH_LIMIT=20 pnpm run test:e2e:cors
 * E2E_PROBE_PATH=/network/eip155:1 pnpm exec playwright test tests/e2e/cors-policy.e2e.ts -g probe
 * E2E_START_PATH=/network/eip155:1 pnpm exec playwright test tests/e2e/cors-policy.e2e.ts
 * ```
 */
import { expect, test, type Page, type TestInfo } from '@playwright/test'

import {
	assertMainSettled,
	browserDevServerContaminationError,
	collectBrowserCorsPolicyViolations,
	expectMainVisible,
	installChainlistRpcsJsonStub,
	type PageRuntimeDiagnostics,
	setupPageRuntimeDiagnostics,
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
const startPath = process.env.E2E_START_PATH?.trim()

const browserNetworkActivityCounter = (page: Page) => {
	let count = 0
	page.on('request', () => {
		count += 1
	})
	page.on('requestfinished', () => {
		count += 1
	})
	page.on('requestfailed', () => {
		count += 1
	})
	return () => count
}

/** After `#main` + alerts settle, wait for a quiet browser-network window (CORS logs often lag paint). */
const waitForPageFetchSettle = async (
	page: Page,
	violationCount: () => number,
	networkActivityCount: () => number,
	diagnostics?: PageRuntimeDiagnostics
) => {
	await assertMainSettled(page, settleTimeoutMs, diagnostics)

	await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {})

	const deadline = Date.now() + settleTimeoutMs
	let lastCount = violationCount()
	let lastNetworkActivityCount = networkActivityCount()
	let quietSince = Date.now()

	while (Date.now() < deadline) {
		await page.waitForTimeout(250)
		const count = violationCount()
		const networkCount = networkActivityCount()
		if (
			count !== lastCount
			|| networkCount !== lastNetworkActivityCount
		) {
			lastCount = count
			lastNetworkActivityCount = networkCount
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
	testInfo: TestInfo
) => {
	if (violations.length === 0) return

	const uniqueViolations = [...new Set(violations)]

	await testInfo.attach(`cors-violations-${path.replace(/\//g, '_') || 'root'}.txt`, {
		body: uniqueViolations.join('\n'),
		contentType: 'text/plain',
	})

	expect(
		uniqueViolations,
		`CORS policy violations on ${path}:\n${uniqueViolations.join('\n')}`
	).toEqual([])
}

const routeViewSmokeDevServerContaminationGate = (page: Page) => (
	page.waitForEvent('console', {
		predicate: (message) => (
			browserDevServerContaminationError(message.text()) != null
		),
		timeout: 0,
	}).then((message) => {
		const error = browserDevServerContaminationError(message.text())
		if (error) throw error
	})
)

test.describe('cors policy (no blocked cross-origin fetches)', () => {
	test.describe.configure({ mode: 'serial' })

	test('probe route', async ({ page }, testInfo) => {
		test.skip(probePath == null || probePath === '', 'set E2E_PROBE_PATH')
		testInfo.setTimeout(settleTimeoutMs + gotoLoadTimeoutMs + 60_000)
		page.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
		await installChainlistRpcsJsonStub(page)
		const diagnostics = setupPageRuntimeDiagnostics(page)
		const violations = collectBrowserCorsPolicyViolations(page)
		const networkActivityCount = browserNetworkActivityCounter(page)
		const devServerContaminationGate = routeViewSmokeDevServerContaminationGate(page)
		await Promise.race([
			(async () => {
				await diagnostics.step(page.goto(probePath!, {
					waitUntil: 'load',
					timeout: gotoLoadTimeoutMs,
				}))
				await expectMainVisible(page, settleTimeoutMs, diagnostics)
				await waitForPageFetchSettle(page, () => violations.length, networkActivityCount, diagnostics)
			})(),
			devServerContaminationGate,
		])
		await assertNoCorsViolations(page, violations, probePath!, testInfo)
	})

	test('every +page URL', async ({ browser }, testInfo) => {
		test.skip(probePath != null && probePath !== '', 'E2E_PROBE_PATH skips full matrix')

		const all = await discoverPathnamesFromRoutes()
		const limitRaw = process.env.E2E_PATH_LIMIT ?? ''
		const limit = Number(limitRaw)
		let pageUrls = (
			limitRaw !== '' && Number.isFinite(limit) && limit > 0 ?
				all.slice(0, limit)
			:
				all
		)
		if (startPath) {
			const index = pageUrls.indexOf(startPath)
			pageUrls = index === -1 ? pageUrls : pageUrls.slice(index)
		}

		testInfo.setTimeout(pageUrls.length * (settleTimeoutMs + gotoLoadTimeoutMs + corsQuietMs + 30_000) + 60_000)

		for (const path of pageUrls) {
			await test.step(path, async () => {
				console.log(`[cors-policy] ${path}`)
				const page = await browser.newPage()
				const diagnostics = setupPageRuntimeDiagnostics(page)
				const violations = collectBrowserCorsPolicyViolations(page)
				const networkActivityCount = browserNetworkActivityCounter(page)
				try {
					page.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
					await installChainlistRpcsJsonStub(page)
					const devServerContaminationGate = routeViewSmokeDevServerContaminationGate(page)
					await Promise.race([
						(async () => {
							await diagnostics.step(page.goto(path, {
								waitUntil: 'load',
								timeout: gotoLoadTimeoutMs,
							}))
							await expectMainVisible(page, settleTimeoutMs, diagnostics)
							await waitForPageFetchSettle(page, () => violations.length, networkActivityCount, diagnostics)
						})(),
						devServerContaminationGate,
					])
					await assertNoCorsViolations(page, violations, path, testInfo)
				}
				finally {
					await page.close()
				}
			})
		}
	})
})
