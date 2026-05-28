import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	chainlistRpcsWire,
	clearOriginOpfs,
	collectIssues,
	countRequestsMatching,
	e2eBrowserNewContextOptions,
	ethereumListsChainsJsonWire,
	installChainlistRpcsJsonStub,
} from '../_e2eBrowserHelpers.ts'

import { discoverPathnamesFromRoutes } from './_routeDiscovery.ts'


/** `load` can exceed the default 15s navigation timeout after OPFS + many client navigations. */
const gotoLoadTimeoutMs = 120_000


test.describe.configure({ mode: 'serial' })

test.describe('TanStack query lifecycle + cache', () => {
	let pageUrls: string[] = []

	test.beforeAll(async () => {
		const all = await discoverPathnamesFromRoutes()
		const limitRaw = process.env.E2E_PATH_LIMIT ?? ''
		const limit = Number(limitRaw)
		pageUrls = (
			limitRaw !== '' && Number.isFinite(limit) && limit > 0 ?
				all.slice(0, limit)
			:	all
		)
	})

	test('networks: cold OPFS resolves; reload hydrates from OPFS; OPFS clear refetches', async ({
		browser,
	}) => {
		test.setTimeout(600_000)
		const ctx1 = await browser.newContext(e2eBrowserNewContextOptions())
		const page = await ctx1.newPage()
		await installChainlistRpcsJsonStub(page)
		const issues = collectIssues(page)

		await page.goto('/', { waitUntil: 'domcontentloaded' })
		await clearOriginOpfs(page)
		await page.reload({ waitUntil: 'domcontentloaded' })
		await expect(page.locator('#main')).toBeVisible({ timeout: 120_000 })

		const networkListSources = countRequestsMatching(page, (url, method) => (
			chainlistRpcsWire(url)
			|| ethereumListsChainsJsonWire(url, method)
		))

		const coldRpc = page.waitForResponse(
			(r) => chainlistRpcsWire(r.url()),
			{ timeout: 120_000 },
		)
		await page.goto('/networks', { waitUntil: 'load' })
		await coldRpc
		await expect(page.locator('#networks')).toBeVisible()
		await expect(page.locator('#networks').getByText('Loading networks…')).toHaveCount(
			0,
			{ timeout: 120_000 },
		)
		await expect(page.locator('#networks').locator('a[href$="/network/eip155:1"]').first()).toBeVisible()

		expect(networkListSources.get(), 'cold load should call network list resolvers').toBeGreaterThan(0)
		const afterFirst = networkListSources.get()
		networkListSources.detach()

		await assertMainSettled(page)

		const reloadNetworkListSources = countRequestsMatching(page, (url, method) => (
			chainlistRpcsWire(url)
			|| ethereumListsChainsJsonWire(url, method)
		))
		await page.reload({ waitUntil: 'load' })
		await expect(page.locator('#main')).toBeVisible({ timeout: 120_000 })
		await expect(page.locator('#networks')).toBeVisible({ timeout: 120_000 })
		await expect(page.locator('#networks').locator('a[href$="/network/eip155:1"]').first()).toBeVisible({
			timeout: 120_000,
		})
		reloadNetworkListSources.detach()
		expect(
			reloadNetworkListSources.get(),
			`reload should serve network list from OPFS without Chainlist / ethereum-lists HTTP (cold count ${afterFirst})`,
		).toBe(0)

		await ctx1.close()

		const wipeCtx = await browser.newContext(e2eBrowserNewContextOptions())
		const wipePage = await wipeCtx.newPage()
		await wipePage.goto('/', { waitUntil: 'load' })
		await clearOriginOpfs(wipePage)
		await wipeCtx.close()

		const ctx2 = await browser.newContext(e2eBrowserNewContextOptions())
		const page2 = await ctx2.newPage()
		await installChainlistRpcsJsonStub(page2)
		const networkListSources2 = countRequestsMatching(page2, (url, method) => (
			chainlistRpcsWire(url)
			|| ethereumListsChainsJsonWire(url, method)
		))
		const coldRpc2 = page2.waitForResponse(
			(r) => chainlistRpcsWire(r.url()),
			{ timeout: 120_000 },
		)
		await page2.goto('/networks', { waitUntil: 'load' })
		await coldRpc2
		await expect(page2.locator('#networks')).toBeVisible()
		await expect(page2.locator('#networks').getByText('Loading networks…')).toHaveCount(
			0,
			{ timeout: 120_000 },
		)
		await expect(page2.locator('#networks').locator('a[href$="/network/eip155:1"]').first()).toBeVisible()
		expect(
			networkListSources2.get(),
			'empty OPFS + fresh JS should call network list resolvers',
		).toBeGreaterThan(0)

		networkListSources2.detach()
		await ctx2.close()
		expect(issues, issues.join('\n')).toEqual([])
	})

	test('every +page URL: no console errors, no alerts, main settles', async ({ page }) => {
		test.setTimeout(900_000)
		page.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
		await installChainlistRpcsJsonStub(page)
		const issues = collectIssues(page)
		await page.goto('/', { waitUntil: 'load', timeout: gotoLoadTimeoutMs })
		await clearOriginOpfs(page)
		await page.reload({ waitUntil: 'load', timeout: gotoLoadTimeoutMs })
		await expect(page.locator('#main')).toBeVisible({ timeout: 120_000 })
		await assertMainSettled(page)

		for (const url of pageUrls) {
			await test.step(url, async () => {
				const issueStart = issues.length
				await page.goto(url, { waitUntil: 'load', timeout: gotoLoadTimeoutMs })
				await expect(
					page.locator('#main'),
					`#main missing after goto ${url} (final URL: ${page.url()})`,
				).toBeVisible({ timeout: 120_000 })
				await assertMainSettled(page)
				const fromPage = issues.slice(issueStart)
				expect(fromPage, `${url}\n${fromPage.join('\n')}`).toEqual([])
			})
		}
	})

	test('navigation stress: networks, home, contracts loop', async ({ page }) => {
		test.setTimeout(120_000)
		await installChainlistRpcsJsonStub(page)
		const issues = collectIssues(page)
		const cycle = ['/networks', '/', '/contracts'] as const

		for (let i = 0; i < 40; i += 1) {
			await page.goto(cycle[i % cycle.length], { waitUntil: 'domcontentloaded' })
			await expect(page.locator('#main')).toBeVisible()
			await assertMainSettled(page)
		}

		expect(issues, issues.join('\n')).toEqual([])
	})
})
