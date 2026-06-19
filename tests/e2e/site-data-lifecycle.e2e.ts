import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	e2eBrowserNewContextOptions,
	expectMainVisible,
	installChainlistRpcsJsonStub,
	setupPageRuntimeDiagnostics,
} from '../_e2eBrowserHelpers.ts'

import { discoverPathnamesFromRoutes } from './_routeDiscovery.ts'


const settleTimeoutMs = (() => {
	const n = Number(process.env.E2E_SETTLE_TIMEOUT_MS ?? '')
	return Number.isFinite(n) && n > 0 ? n : 60_000
})()

test.describe('site data lifecycle', () => {
	test('every route: no console issues; load → cache → cold profile', async ({ browser }) => {
		test.setTimeout(900_000)

		const pathnamesAll = await discoverPathnamesFromRoutes()
		const limitRaw = process.env.E2E_PATH_LIMIT ?? ''
		const limit = Number(limitRaw)
		const pathnames = (
			limitRaw !== '' && Number.isFinite(limit) && limit > 0 ?
				pathnamesAll.slice(0, limit)
			:
				pathnamesAll
		)

		for (const pathname of pathnames) {
			await test.step(pathname, async () => {
				const warmCtx = await browser.newContext(e2eBrowserNewContextOptions())
				const page = await warmCtx.newPage()
				await installChainlistRpcsJsonStub(page)
				const diagnostics = setupPageRuntimeDiagnostics(page, { forwardConsole: true })

				let coldProxies = 0
				const onCold = (req: import('@playwright/test').Request) => {
					if (req.url().includes('/api-proxy/')) coldProxies += 1
				}
				page.on('request', onCold)

				await diagnostics.step(page.goto(pathname, { waitUntil: 'domcontentloaded' }))
				await expectMainVisible(page, settleTimeoutMs, diagnostics)
				await assertMainSettled(page, settleTimeoutMs, diagnostics)

				page.off('request', onCold)

				let reloadProxies = 0
				const onReload = (req: import('@playwright/test').Request) => {
					if (req.url().includes('/api-proxy/')) reloadProxies += 1
				}
				page.on('request', onReload)

				await diagnostics.step(page.reload({ waitUntil: 'domcontentloaded' }))
				await expectMainVisible(page, settleTimeoutMs, diagnostics)
				await assertMainSettled(page, settleTimeoutMs, diagnostics)

				page.off('request', onReload)

				expect(
					reloadProxies,
					`expected zero /api-proxy/ after warm reload for ${pathname} (cold had ${coldProxies})`
				).toBe(0)

				expect(diagnostics.issues, `${pathname} warm\n${diagnostics.issues.join('\n')}`).toEqual([])

				await warmCtx.close()

				const coldCtx = await browser.newContext(e2eBrowserNewContextOptions())
				const pageCold = await coldCtx.newPage()
				await installChainlistRpcsJsonStub(pageCold)
				const coldDiagnostics = setupPageRuntimeDiagnostics(pageCold, { forwardConsole: true })

				let freshProxies = 0
				const onFresh = (req: import('@playwright/test').Request) => {
					if (req.url().includes('/api-proxy/')) freshProxies += 1
				}
				pageCold.on('request', onFresh)

				await coldDiagnostics.step(pageCold.goto(pathname, { waitUntil: 'domcontentloaded' }))
				await expectMainVisible(pageCold, settleTimeoutMs, coldDiagnostics)
				await assertMainSettled(pageCold, settleTimeoutMs, coldDiagnostics)

				pageCold.off('request', onFresh)

				if (coldProxies > 0)
					expect(
						freshProxies,
						`expected /api-proxy/ on fresh browser profile for ${pathname}`
					).toBeGreaterThan(0)

				expect(coldDiagnostics.issues, `${pathname} cold\n${coldDiagnostics.issues.join('\n')}`).toEqual([])

				await coldCtx.close()
			})
		}

		await test.step('navigation stress', async () => {
			const stressCtx = await browser.newContext(e2eBrowserNewContextOptions())
			const stressPage = await stressCtx.newPage()
			await installChainlistRpcsJsonStub(stressPage)
			const stressDiagnostics = setupPageRuntimeDiagnostics(stressPage, { forwardConsole: true })

			for (const p of pathnames.slice(0, Math.min(24, pathnames.length))) {
				await stressDiagnostics.step(stressPage.goto(p, { waitUntil: 'domcontentloaded' }))
				await expectMainVisible(stressPage, settleTimeoutMs, stressDiagnostics)
				await assertMainSettled(stressPage, settleTimeoutMs, stressDiagnostics)
			}

			expect(stressDiagnostics.issues, stressDiagnostics.issues.join('\n')).toEqual([])
			await stressCtx.close()
		})
	})
})
