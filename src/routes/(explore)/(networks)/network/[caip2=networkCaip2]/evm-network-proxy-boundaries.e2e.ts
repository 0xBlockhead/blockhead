import { expect, test, type Page } from '@playwright/test'
import {
	clearOriginOpfs,
	installChainlistRpcsJsonStub,
} from '../../../../../../tests/_e2eBrowserHelpers.ts'


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
	})

	return {
		step,
	}
}

test.describe('EVM network selection field boundaries', () => {
	test('network summary and first-layer subviews resolve through field resources', async ({ page }, testInfo) => {
		testInfo.setTimeout(240_000)
		const { step } = setupFailFast(page)

		await installChainlistRpcsJsonStub(page)
		await step(page.goto('/', { waitUntil: 'domcontentloaded', timeout: 120_000 }))
		await clearOriginOpfs(page)
		await step(page.goto('/network/eip155:1', { waitUntil: 'load', timeout: 120_000 }))

		await step(expect(page.locator('#main')).toBeVisible({ timeout: 120_000 }))
		await step(expect(page.locator('#main [data-error]')).toHaveCount(0))
		await step(expect(page.locator('#network-summary-head-block')).toBeVisible({
			timeout: 120_000,
		}))
		await step(expect(
			page.locator('#network-summary-head-block a[href*="/block/"]')
				.or(page.locator('#network-summary-head-block span[data-text="muted"]'))
				.or(page.locator('#network-summary-head-block [data-tag][aria-label]'))
		).toBeAttached({
			timeout: 120_000,
		}))

		await step(expect(page.locator('.network-view-collapsible-assets')).toBeAttached({
			timeout: 120_000,
		}))
		await step(expect(page.locator('.network-view-collapsible-topology')).toBeAttached({
			timeout: 120_000,
		}))
		await step(expect(page.locator('.network-view-collapsible-execution')).toBeAttached({
			timeout: 120_000,
		}))
	})
})
