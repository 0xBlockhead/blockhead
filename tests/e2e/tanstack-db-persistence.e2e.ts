import { expect, test, type Page } from '@playwright/test'

import {
	assertMainSettled,
	chainlistRpcsWire,
	clearOriginOpfs,
	countRequestsMatching,
	e2eBrowserNewContextOptions,
	ethereumListsChainsJsonWire,
} from '../_e2eBrowserHelpers.ts'

import { discoverPathnamesFromRoutes } from './_routeDiscovery.ts'


const gotoLoadTimeoutMs = 120_000

const persistedCatalogWire = (url: string, method: string) => (
	method === 'GET'
	&& (
		chainlistRpcsWire(url)
		|| ethereumListsChainsJsonWire(url, method)
	)
)

const blockPersistedCatalogRequests = async (page: Page) => {
	const blockedUrls: string[] = []
	await page.route('**/*', async (route) => {
		const request = route.request()
		const url = request.url()
		if (persistedCatalogWire(url, request.method())) {
			blockedUrls.push(url)
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: '[]',
			})
			return
		}

		await route.fallback()
	})
	return blockedUrls
}

const ignoreKnownRealNetworkNoise = (text: string) => (
	text.includes('Failed to load resource: the server responded with a status of 404')
	|| text.includes('Failed to load resource: the server responded with a status of 400')
	|| text.includes('Failed to load resource: the server responded with a status of 422')
	|| text.includes('Failed to load resource: the server responded with a status of 502')
	|| text.includes('Failed to load resource: net::ERR_CONNECTION_REFUSED')
	|| text.includes('Failed to load resource: net::ERR_FAILED')
	|| text.includes('Failed to load resource: net::ERR_QUIC_PROTOCOL_ERROR')
	|| text.includes('has been blocked by CORS policy')
	|| text.includes('Voltaire: block stream ended')
	|| (
		text.includes('[QueryCollection]')
		&& (
			text.includes('Atproto')
			|| text.includes('blockscout.com')
			|| text.includes('coingecko.com')
			|| text.includes('defillama.com')
			|| text.includes('tradingview.com')
		)
	)
)

const collectBlockingIssues = (page: Page) => {
	const issues: string[] = []
	page.on('pageerror', (error) => {
		issues.push(`pageerror: ${error.message}`)
	})
	page.on('console', (message) => {
		const text = message.text()
		if (
			message.type() === 'error'
			&& !ignoreKnownRealNetworkNoise(text)
		)
			issues.push(`console error: ${text}`)

		if (
			message.type() === 'warning'
			&& text.includes('Calling .preload() on a collection with syncMode "on-demand" is a no-op')
		)
			issues.push(`console warning: ${text}`)
	})
	return issues
}

const pathnamesForRun = async () => {
	const all = await discoverPathnamesFromRoutes()
	const includeRaw = process.env.E2E_REAL_PERSISTENCE_PATHS ?? ''
	const includes = includeRaw.split(',').map((path) => path.trim()).filter(Boolean)
	const selected = includes.length > 0 ?
		all.filter((path) => includes.includes(path))
	:	all
	const limitRaw = process.env.E2E_REAL_PERSISTENCE_PATH_LIMIT ?? ''
	const limit = Number(limitRaw)
	return (
		limitRaw !== '' && Number.isFinite(limit) && limit > 0 ?
			selected.slice(0, limit)
		:
			selected
	)
}


test.describe.configure({ mode: 'serial' })

test.describe('real OPFS persistence', () => {
	let pageUrls: string[] = []

	test.beforeAll(async () => {
		pageUrls = await pathnamesForRun()
	})

	test('route-discovered views hydrate persisted catalog subsets after reload', async ({ browser }) => {
		test.setTimeout(30 * 60_000)

		const context = await browser.newContext(e2eBrowserNewContextOptions())
		const wipePage = await context.newPage()
		await wipePage.route('**/*', async (route) => {
			const request = route.request()
			if (new URL(request.url()).pathname === '/__e2e_blank') {
				await route.fulfill({
					status: 200,
					contentType: 'text/html',
					body: '<!doctype html><title>e2e blank</title>',
				})
				return
			}
			if (persistedCatalogWire(request.url(), request.method())) {
				await route.abort('blockedbyclient')
				return
			}

			await route.fallback()
		})
		await wipePage.goto('/__e2e_blank', { waitUntil: 'domcontentloaded', timeout: gotoLoadTimeoutMs })
		await clearOriginOpfs(wipePage)
		await wipePage.close()

		const page = await context.newPage()
		page.setDefaultNavigationTimeout(gotoLoadTimeoutMs)
		const issues = collectBlockingIssues(page)

		const checkedUrls: string[] = []

		for (const url of pageUrls) {
			await test.step(url, async () => {
				const issueStart = issues.length
				const cold = countRequestsMatching(page, persistedCatalogWire)

				await page.goto(url, { waitUntil: 'domcontentloaded', timeout: gotoLoadTimeoutMs })
				await expect(
					page.locator('#main'),
					`#main missing after cold goto ${url} (final URL: ${page.url()})`,
				).toBeVisible({ timeout: 120_000 })
				if (url === '/network/1')
					await expect(page.locator('[data-e2e="network-carousel-groups"]')).toBeAttached({
						timeout: 120_000,
					})
				else if (url === '/networks')
					await expect(page.getByRole('link', { name: 'Ethereum', exact: true }).first()).toBeVisible({
						timeout: 120_000,
					})
				else
					await assertMainSettled(page)

				// The persisted wrapper commits OPFS transactions asynchronously after query data renders.
				await page.waitForTimeout(8_000)

				const coldCount = cold.get()
				const coldUrls = [...cold.urls]
				cold.detach()

				if (coldCount === 0) {
					expect(
						issues.slice(issueStart),
						`${url}\n${issues.slice(issueStart).join('\n')}`,
					).toEqual([])
					return
				}

				const blockedWarmUrls = await blockPersistedCatalogRequests(page)
				const warm = countRequestsMatching(page, persistedCatalogWire)

				await page.reload({ waitUntil: 'domcontentloaded', timeout: gotoLoadTimeoutMs })
				await expect(
					page.locator('#main'),
					`#main missing after warm reload ${url} (final URL: ${page.url()})`,
				).toBeVisible({ timeout: 120_000 })
				if (url === '/network/1')
					await expect(page.locator('[data-e2e="network-carousel-groups"]')).toBeAttached({
						timeout: 120_000,
					})
				else if (url === '/networks')
					await expect(page.getByRole('link', { name: 'Ethereum', exact: true }).first()).toBeVisible({
						timeout: 120_000,
					})
				else
					await assertMainSettled(page)

				warm.detach()
				await page.unroute('**/*')

				expect(
					warm.get(),
					`${url} warm reload repeated persisted catalog requests after cold requests:\n${coldUrls.join('\n')}`,
				).toBe(0)
				expect(
					blockedWarmUrls,
					`${url} warm reload should not request persisted catalog URLs`,
				).toEqual([])
				expect(
					issues.slice(issueStart),
					`${url}\n${issues.slice(issueStart).join('\n')}`,
				).toEqual([])

				checkedUrls.push(url)
			})
		}

		expect(
			checkedUrls.length,
			'At least one discovered view must exercise real persisted catalog requests',
		).toBeGreaterThan(0)

		await context.close()
	})
})
