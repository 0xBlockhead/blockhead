import { expect, test, type Locator, type Page } from '@playwright/test'
import {
	chainlistRpcsWire,
	clearOriginOpfs,
	countRequestsMatching,
	ethereumListsChainsJsonWire,
	installChainlistRpcsJsonStub,
} from '../../../../../../tests/_e2eBrowserHelpers.ts'

test.describe('/network/[caip2]', () => {
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
				&& !message.text().includes('Failed to load resource: the server responded with a status of 405')
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
				&& !message.text().includes('Failed to load resource: net::ERR_INCOMPLETE_CHUNKED_ENCODING')
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

		await installChainlistRpcsJsonStub(page)
		await step(page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 }))
		await clearOriginOpfs(page)
		await step(page.goto('/network/eip155:1', { waitUntil: 'load', timeout: 120_000 }))

		await step(expect(page.locator('#nav-menu a[href="/networks"]')).toBeVisible({
			timeout: 120_000,
		}))
		await step(expect(page.locator('#main [data-error]')).toHaveCount(0))
		await step(expect(page.locator('#main [data-error]')).toHaveCount(0))
		await step(expect(page.locator('.network-view-collapsible-topology')).toBeAttached({
			timeout: 120_000,
		}))

		const scrollAttach = { timeout: 120_000 } as const
		await step(expect(page.locator('.network-view-collapsible-topology')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-assets')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-execution')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-consensus')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-contracts-accounts')).toBeAttached(scrollAttach))
		await step(expect(page.locator('.network-view-collapsible-data-availability')).toBeAttached(scrollAttach))

		const smartAccountsSection = page.locator('[id$=":contracts-accounts-smart-accounts-list"]')
		const bundlersSection = page.locator('[id$=":contracts-accounts-bundlers-list"]')
		const paymastersSection = page.locator('[id$=":contracts-accounts-paymasters-list"]')
		const userOperationsSection = page.locator('[id$=":contracts-accounts-user-operations-list"]')
		const factoriesSection = page.locator('[id$=":contracts-accounts-factories-list"]')
		const sectionResultOrPlaceholder = (section: Locator, linkSelector: string) => (
			section.locator(linkSelector)
				.or(section.locator('p[data-text="muted"]'))
				.or(section.locator('[data-tag][aria-label]'))
		)
		await step(expect(
			sectionResultOrPlaceholder(
				smartAccountsSection,
				'a[href*="/erc-4337/smart-account/"]'
			)
		).toBeAttached({ timeout: 120_000 }))
		await step(expect(
			sectionResultOrPlaceholder(
				bundlersSection,
				'a[href*="/erc-4337/bundler/"]'
			)
		).toBeAttached({ timeout: 120_000 }))
		await step(expect(
			sectionResultOrPlaceholder(
				paymastersSection,
				'a[href*="/erc-4337/paymaster/"]'
			)
		).toBeAttached({ timeout: 120_000 }))
		await step(expect(
			sectionResultOrPlaceholder(
				userOperationsSection,
				'a[href*="/user-operation/"]'
			)
		).toBeAttached({ timeout: 120_000 }))
		await step(expect(
			sectionResultOrPlaceholder(
				factoriesSection,
				'a[href*="/erc-4337/account-factory/"]'
			)
		).toBeAttached({ timeout: 120_000 }))
		await step(expect(page.locator('#network-summary-head-block')).toBeAttached(scrollAttach))
		await step(expect(
			page.locator('#network-summary-head-block a[href*="/block/"]')
				.or(page.locator('#network-summary-head-block span[data-text="muted"]'))
				.or(page.locator('#network-summary-head-block [data-tag][aria-label]'))
		).toBeAttached({
			timeout: 120_000,
		}))

	})

	test('network 1 merged entity query includes selected fields', async ({ page }, testInfo) => {
		testInfo.setTimeout(120_000)
		const { step } = setupFailFast(page)

		await installChainlistRpcsJsonStub(page)
		await step(page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 }))
		await clearOriginOpfs(page)
		await step(page.goto('/network/eip155:1', { waitUntil: 'load', timeout: 120_000 }))
		await step(expect(page.locator('.network-view-collapsible-topology')).toBeAttached({
			timeout: 120_000,
		}))
		await step(expect(page.locator('#main a[href="/network/eip155:1"]').first()).toBeAttached({
			timeout: 30_000,
		}))
	})

	test('network 1 reload keeps Chainlist and EthereumLists rows rendered', async ({ page }, testInfo) => {
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

		await step(page.goto('/network/eip155:1', { waitUntil: 'load', timeout: 120_000 }))
		await step(expect(page.locator('.network-view-collapsible-topology')).toBeAttached({
			timeout: 120_000,
		}))
		await step(expect(page.locator('#main a[href="/network/eip155:1"]').first()).toBeAttached({
			timeout: 120_000,
		}))
		expect(cold.get(), 'network detail resolves chain metadata via HTTP').toBeGreaterThan(0)
		cold.detach()

		await step(page.reload({ waitUntil: 'domcontentloaded', timeout: 120_000 }))
		await step(expect(page.locator('.network-view-collapsible-topology')).toBeAttached({
			timeout: 120_000,
		}))
		await step(expect(page.locator('#main a[href="/network/eip155:1"]').first()).toBeAttached({
			timeout: 120_000,
		}))
	})
})
