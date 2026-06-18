import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	chainlistRpcsWire,
	collectIssues,
	countRequestsMatching,
	ethereumListsChainsJsonWire,
	installChainlistRpcsJsonStub,
} from '../_e2eBrowserHelpers.ts'

import { discoverPathnamesFromRoutes } from './_routeDiscovery.ts'


/** `load` can exceed the default 15s navigation timeout after many client navigations. */
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
			:
				all
		)
	})

	test('networks: cold live collection load resolves provider-backed rows', async ({ page }) => {
		test.setTimeout(240_000)
		await installChainlistRpcsJsonStub(page)
		const issues = collectIssues(page)

		await page.goto('/', { waitUntil: 'domcontentloaded', timeout: gotoLoadTimeoutMs })
		await expect(page.locator('#main')).toBeVisible({ timeout: 120_000 })

		const networkListSources = countRequestsMatching(page, (url, method) => (
			chainlistRpcsWire(url)
			|| ethereumListsChainsJsonWire(url, method)
		))

		const coldRpc = page.waitForResponse(
			(r) => chainlistRpcsWire(r.url()),
			{ timeout: 120_000 }
		)
		await page.goto('/networks', { waitUntil: 'load' })
		await coldRpc
		await expect(page.locator('#networks')).toBeVisible()
		await expect(page.locator('#networks').locator('a[href$="/network/eip155:1"]').first()).toBeVisible({
			timeout: 120_000,
		})

		expect(networkListSources.get(), 'cold load should call network list resolvers').toBeGreaterThan(0)
		networkListSources.detach()

		await assertMainSettled(page)
		expect(issues, issues.join('\n')).toEqual([])
	})

	test('every +page URL: no console errors, no alerts, main settles', async ({ page }) => {
		test.setTimeout(900_000)
		page.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
		await installChainlistRpcsJsonStub(page)
		const issues = collectIssues(page)
		await page.goto('/', { waitUntil: 'load', timeout: gotoLoadTimeoutMs })
		await expect(page.locator('#main')).toBeVisible({ timeout: 120_000 })
		await assertMainSettled(page)

		for (const url of pageUrls) {
			await test.step(url, async () => {
				const issueStart = issues.length
				await page.goto(url, { waitUntil: 'load', timeout: gotoLoadTimeoutMs })
				await expect(
					page.locator('#main'),
					`#main missing after goto ${url} (final URL: ${page.url()})`
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
