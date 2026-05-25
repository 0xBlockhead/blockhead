import { expect, test, type Page } from '@playwright/test'

const SAMPLE_TOKEN_TRANSFER_TX = (
	'0x5e4763cd6b6f129869fff1d60bfadf1d37e1677cb8f1d8997299680da09d5b01'
)

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
			&& !message.text().includes('Failed to load resource: net::ERR_FAILED')
			&& !message.text().includes('has been blocked by CORS policy')
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

test.describe('/network/[networkId]/tx/[transactionId]', () => {
	test('transaction page shows hash, kind, status, and movements or events', async ({ page }, testInfo) => {
		testInfo.setTimeout(240_000)
		const { step } = setupFailFast(page)

		await step(page.goto(
			`/network/1/tx/${SAMPLE_TOKEN_TRANSFER_TX}`,
			{ waitUntil: 'load', timeout: 120_000 },
		))

		await step(expect(page.locator('[data-tx-hash]')).toBeAttached({
			timeout: 120_000,
		}))

		await step(expect(page.getByText('Kind', { exact: true })).toBeAttached({
			timeout: 120_000,
		}))

		await step(expect(page.getByText('Status', { exact: true })).toBeAttached({
			timeout: 120_000,
		}))

		await step(expect(
			page.locator('section[data-scroll-marker-label="Movements"]')
				.or(page.locator('section[data-scroll-marker-label="Events"]'))
				.first(),
		).toBeAttached({
			timeout: 120_000,
		}))
	})
})
