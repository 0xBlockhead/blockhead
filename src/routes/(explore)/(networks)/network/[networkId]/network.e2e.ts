import { expect, test, type Page } from '@playwright/test'
import {
	chainlistRpcsWire,
	clearOriginOpfs,
	countRequestsMatching,
	ethereumListsChainsJsonWire,
	installChainlistRpcsJsonStub,
} from '../../../../../../tests/_e2eBrowserHelpers.ts'

test.describe('/network/[networkId]', () => {
	const setupFailFast = (page: Page) => {
		let failed = false
		let rejectRuntimeError: ((error: Error) => void) | undefined
		const runtimeError = new Promise<never>((_, reject) => {
			rejectRuntimeError = reject
		})
		const failFast = (error: Error) => {
			if (failed) return
			failed = true
			rejectRuntimeError?.(error)
		}
		const step = async <_Value>(promise: Promise<_Value>) => {
			await Promise.race([promise, runtimeError])
		}

		page.on('pageerror', (error) => {
			failFast(new Error(`pageerror: ${error.message}`))
		})

		page.on('console', (message) => {
			if (
				message.type() === 'error'
				&& !message.text().includes('Failed to load resource: the server responded with a status of 400')
				&& !message.text().includes('Failed to load resource: the server responded with a status of 403')
				&& !message.text().includes('Failed to load resource: the server responded with a status of 404')
				&& !message.text().includes('Failed to load resource: the server responded with a status of 422')
				&& !message.text().includes('Failed to load resource: the server responded with a status of 429')
				&& !message.text().includes('Failed to load resource: the server responded with a status of 500')
				&& !message.text().includes('Failed to load resource: the server responded with a status of 502')
				&& !message.text().includes('Failed to load resource: the server responded with a status of 503')
				&& !message.text().includes('[vite] Failed to reload')
				&& !message.text().includes('Failed to fetch dynamically imported module')
				&& !message.text().includes('Failed to load resource: net::ERR_QUIC_PROTOCOL_ERROR')
				&& !message.text().includes('Failed to load resource: net::ERR_CONNECTION_REFUSED')
				&& !message.text().includes('Failed to load resource: net::ERR_FAILED')
				&& !message.text().includes('has been blocked by CORS policy')
				&& !message.text().includes('Voltaire: block stream ended')
				&& !(
					message.text().includes('[QueryCollection]')
					&& (
						/resolver\(s\) failed/.test(message.text())
						|| /Fetch failed \(\d{3}/.test(message.text())
					)
				)
			) failFast(new Error(`console error: ${message.text()}`))
			if (
				message.type() === 'warning'
				&& message.text().includes('Calling .preload() on a collection with syncMode "on-demand" is a no-op')
			) failFast(new Error(`console warning: ${message.text()}`))
		})

		return {
			step,
		}
	}

	test('network 1 loads with no runtime errors and renders subviews', async ({ page }, testInfo) => {
		testInfo.setTimeout(240_000)
		const { step } = setupFailFast(page)

		await step(page.goto('/network/1', { waitUntil: 'load', timeout: 120_000 }))

		await step(expect(page.locator('#nav-menu').getByRole('link', { name: 'Networks' })).toBeVisible({
			timeout: 120_000,
		}))
		await step(expect(page.getByRole('heading', { name: '500' })).toHaveCount(0))
		await step(expect(page.getByText('Internal Error')).toHaveCount(0))
		await step(expect(page.locator('.network-view-carousel-groups')).toBeAttached({
			timeout: 120_000,
		}))

		const scrollAttach = { timeout: 120_000 } as const
		await step(expect(page.locator('.network-view-collapsible-topology')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-economics')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-execution')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-consensus')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-data-storage')).toBeAttached(scrollAttach))

		await step(expect(page.locator('[data-scroll-marker-label="Blocks"]')).toBeAttached(scrollAttach))
		await step(expect(page.locator('[data-scroll-marker-label="Transactions"]')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-data-storage [data-scroll-marker-label="Verified"]')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-consensus [data-scroll-marker-label="Validators"]')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-execution [data-scroll-marker-label="Mempool"]')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-economics [data-scroll-marker-label="Assets"]')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-economics [data-scroll-marker-label="Gas"]')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-economics [data-scroll-marker-label="MEV-Boost"]')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-erc-4337')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-erc-4337 [data-scroll-marker-label="Smart accounts"]')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-erc-4337 [data-scroll-marker-label="User operations"]')).toBeAttached(scrollAttach))

		const smartAccountsSection = page.locator('[id$=":aa-smart-accounts-list"]')
		const userOperationsSection = page.locator('[id$=":aa-user-operations-list"]')
		await step(expect(
			smartAccountsSection.locator('a[href*="/erc-4337/smart-account/"]')
				.or(smartAccountsSection.locator('p[data-text="muted"]'))
				.or(smartAccountsSection.locator('[data-card] p')),
		).toBeAttached({ timeout: 120_000 }))
		await step(expect(
			userOperationsSection.locator('a[href*="/user-operation/"]')
				.or(userOperationsSection.locator('p[data-text="muted"]'))
				.or(userOperationsSection.locator('[data-card] p')),
		).toBeAttached({ timeout: 120_000 }))
		await step(expect(page.locator('.network-view-collapsible-consensus [data-scroll-marker-label="Upgrades"]')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-consensus [data-scroll-marker-label="Finality"]')).toBeAttached(scrollAttach))
		await step(expect(page.locator('[data-scroll-marker-label="Epochs"]')).toBeAttached(scrollAttach))
		await step(expect(page.locator('[data-scroll-marker-label="Slots"]')).toBeAttached(scrollAttach))
		await step(expect(page.locator('[data-scroll-marker-label="Blobs"]')).toBeAttached(scrollAttach))
		await step(expect(page.locator('#network-summary-head-block')).toBeAttached(scrollAttach))
		await step(expect(page.locator('#network-summary-head-block a[href*="/block/"]')).toBeAttached({
			timeout: 120_000,
		}))

	})

	test('network 1 merged entity query includes selected fields', async ({ page }, testInfo) => {
		testInfo.setTimeout(120_000)
		const { step } = setupFailFast(page)

		await step(page.goto('/network/1', { waitUntil: 'load', timeout: 120_000 }))
		await step(expect(page.locator('.network-view-carousel-groups')).toBeAttached({
			timeout: 120_000,
		}))
		await step(expect(page.getByText('Ethereum Mainnet').first()).toBeVisible({
			timeout: 30_000,
		}))
	})

	test('network 1 reload uses persisted Chainlist and EthereumLists rows', async ({ page }, testInfo) => {
		testInfo.setTimeout(240_000)
		const { step } = setupFailFast(page)
		await installChainlistRpcsJsonStub(page)
		await step(page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 }))
		await clearOriginOpfs(page)
		await step(page.reload({ waitUntil: 'domcontentloaded', timeout: 120_000 }))
		await expect(page.locator('#main')).toBeVisible({ timeout: 120_000 })

		const cold = countRequestsMatching(page, (url, method) => (
			method === 'GET'
			&& (
				chainlistRpcsWire(url)
				|| ethereumListsChainsJsonWire(url, method)
			)
		))

		await step(page.goto('/network/1', { waitUntil: 'load', timeout: 120_000 }))
		await step(expect(page.locator('.network-view-carousel-groups')).toBeAttached({
			timeout: 120_000,
		}))
		await step(expect(page.locator('.network-view-carousel-groups').locator('a[href$="/network/8453"]').first()).toBeVisible({
			timeout: 120_000,
		}))
		expect(cold.get(), 'network detail resolves chain metadata via HTTP').toBeGreaterThan(0)
		cold.detach()

		const blockedWarmRequests: string[] = []
		await page.route('**/*', async (route) => {
			const url = route.request().url()
			const method = route.request().method()
			if (
				method === 'GET'
				&& (
					chainlistRpcsWire(url)
					|| ethereumListsChainsJsonWire(url, method)
				)
			) {
				blockedWarmRequests.push(url)
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: '[]',
				})
				return
			}
			await route.fallback()
		})

		const warm = countRequestsMatching(page, (url, method) => (
			method === 'GET'
			&& (
				chainlistRpcsWire(url)
				|| ethereumListsChainsJsonWire(url, method)
			)
		))

		await step(page.reload({ waitUntil: 'domcontentloaded', timeout: 120_000 }))
		await step(expect(page.locator('.network-view-carousel-groups')).toBeAttached({
			timeout: 120_000,
		}))
		await step(expect(page.locator('.network-view-carousel-groups').locator('a[href$="/network/8453"]').first()).toBeVisible({
			timeout: 120_000,
		}))
		expect(warm.get(), 'reload should hydrate from OPFS without Chainlist / chains.json').toBe(0)
		expect(blockedWarmRequests, 'warm reload must not request Chainlist / chains.json').toEqual([])
		warm.detach()
	})
})
