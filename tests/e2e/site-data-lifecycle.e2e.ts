import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	collectIssues,
	e2eBrowserNewContextOptions,
	installChainlistRpcsJsonStub,
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
			:	pathnamesAll
		)

		for (const pathname of pathnames) {
			await test.step(pathname, async () => {
				const warmCtx = await browser.newContext(e2eBrowserNewContextOptions())
				const page = await warmCtx.newPage()
				await installChainlistRpcsJsonStub(page)
				const issues = collectIssues(page)

				let coldProxies = 0
				const onCold = (req: import('@playwright/test').Request) => {
					if (req.url().includes('/api-proxy/')) coldProxies += 1
				}
				page.on('request', onCold)

				await page.goto(pathname, { waitUntil: 'domcontentloaded' })
				await assertMainSettled(page, settleTimeoutMs)

				page.off('request', onCold)

				let reloadProxies = 0
				const onReload = (req: import('@playwright/test').Request) => {
					if (req.url().includes('/api-proxy/')) reloadProxies += 1
				}
				page.on('request', onReload)

				await page.reload({ waitUntil: 'domcontentloaded' })
				await assertMainSettled(page, settleTimeoutMs)

				page.off('request', onReload)

				expect(
					reloadProxies,
					`expected zero /api-proxy/ after warm reload for ${pathname} (cold had ${coldProxies})`,
				).toBe(0)

				expect(issues, `${pathname} warm\n${issues.join('\n')}`).toEqual([])

				await warmCtx.close()

				const coldCtx = await browser.newContext(e2eBrowserNewContextOptions())
				const pageCold = await coldCtx.newPage()
				await installChainlistRpcsJsonStub(pageCold)
				const issuesCold = collectIssues(pageCold)

				let freshProxies = 0
				const onFresh = (req: import('@playwright/test').Request) => {
					if (req.url().includes('/api-proxy/')) freshProxies += 1
				}
				pageCold.on('request', onFresh)

				await pageCold.goto(pathname, { waitUntil: 'domcontentloaded' })
				await assertMainSettled(pageCold, settleTimeoutMs)

				pageCold.off('request', onFresh)

				if (coldProxies > 0)
					expect(
						freshProxies,
						`expected /api-proxy/ on fresh browser profile for ${pathname}`,
					).toBeGreaterThan(0)

				expect(issuesCold, `${pathname} cold\n${issuesCold.join('\n')}`).toEqual([])

				await coldCtx.close()
			})
		}

		await test.step('navigation stress', async () => {
			const stressCtx = await browser.newContext(e2eBrowserNewContextOptions())
			const stressPage = await stressCtx.newPage()
			await installChainlistRpcsJsonStub(stressPage)
			const stressIssues = collectIssues(stressPage)

			for (const p of pathnames.slice(0, Math.min(24, pathnames.length))) {
				await stressPage.goto(p, { waitUntil: 'domcontentloaded' })
				await assertMainSettled(stressPage, settleTimeoutMs)
			}

			expect(stressIssues, stressIssues.join('\n')).toEqual([])
			await stressCtx.close()
		})
	})
})
