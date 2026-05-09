import { expect, test, type Page } from '@playwright/test'

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
		const step = async (promise: Promise<unknown>) => {
			await Promise.race([promise, runtimeError])
		}

		page.on('pageerror', (error) => {
			failFast(new Error(`pageerror: ${error.message}`))
		})

		page.on('console', (message) => {
			if (
				message.type() === 'error'
				&& !message.text().includes('Failed to load resource: the server responded with a status of 404')
				&& !message.text().includes('Failed to load resource: the server responded with a status of 502')
				&& !message.text().includes('Failed to load resource: net::ERR_QUIC_PROTOCOL_ERROR')
				&& !message.text().includes('Voltaire: block stream ended')
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
		testInfo.setTimeout(120_000)
		const { step } = setupFailFast(page)

		await step(page.goto('/network/1', { waitUntil: 'domcontentloaded' }))

		await step(expect(page.locator('#nav-menu').getByRole('link', { name: 'Networks' })).toBeVisible())
		await step(expect(page.getByRole('heading', { name: '500' })).toHaveCount(0))
		await step(expect(page.getByText('Internal Error')).toHaveCount(0))
		await step(expect(page.locator('[data-e2e="network-carousel-groups"]')).toBeAttached({
			timeout: 120_000,
		}))

		await step(expect(page.locator('[data-e2e="network-collapsible-topology"]')).toBeAttached())
		await step(expect(page.locator('[data-e2e="network-collapsible-economics"]')).toBeAttached())
		await step(expect(page.locator('[data-e2e="network-collapsible-execution"]')).toBeAttached())
		await step(expect(page.locator('[data-e2e="network-collapsible-consensus"]')).toBeAttached())
		await step(expect(page.locator('[data-e2e="network-collapsible-data-storage"]')).toBeAttached())

		await step(expect(page.locator('[data-e2e="network-carousel-blocks"]')).toBeAttached())
		await step(expect(page.locator('[data-e2e="network-carousel-transactions"]')).toBeAttached())
		await step(expect(page.locator('[data-e2e="network-carousel-contracts"]')).toBeAttached())
		await step(expect(page.locator('[data-e2e="network-carousel-beacon-epochs"]')).toBeAttached())
		await step(expect(page.locator('[data-e2e="network-carousel-beacon-slots"]')).toBeAttached())
		await step(expect(page.locator('[data-e2e="network-data-storage-blobs-list"]')).toBeAttached())
		await step(expect(page.locator('[data-e2e="network-summary-head-block"]')).toBeAttached())

	})

	test('network 1 merged entity query includes selected fields', async ({ page }, testInfo) => {
		testInfo.setTimeout(120_000)
		const { step } = setupFailFast(page)

		await page.exposeFunction('__recordBlockheadE2eDebug', (event: {
			key: string
			value: unknown
		}) => {
			;(globalThis as typeof globalThis & {
				__blockheadE2eDebug?: Record<string, unknown>
			}).__blockheadE2eDebug = {
				...(globalThis as typeof globalThis & {
					__blockheadE2eDebug?: Record<string, unknown>
				}).__blockheadE2eDebug,
				[event.key]: event.value,
			}
		})
		await page.addInitScript(() => {
			globalThis.addEventListener('blockhead:e2e-debug', (event) => {
				void (globalThis as typeof globalThis & {
					__recordBlockheadE2eDebug: (detail: unknown) => Promise<void>
				}).__recordBlockheadE2eDebug((event as CustomEvent).detail)
			})
		})

		await step(page.goto('/network/1', { waitUntil: 'domcontentloaded' }))
		await step(expect(page.locator('[data-e2e="network-carousel-groups"]')).toBeAttached({
			timeout: 120_000,
		}))
		await expect.poll(() => (
			(globalThis as typeof globalThis & {
				__blockheadE2eDebug?: Record<string, {
					idKey?: string
					selectedFields?: Record<string, unknown>
				}>
			}).__blockheadE2eDebug
		), {
			timeout: 30_000,
		}).toEqual(expect.objectContaining({
			'useEntity:Network:[{"chainId":1},1]': expect.objectContaining({
				idKey: '[{"chainId":1},1]',
				selectedFields: expect.objectContaining({
					name: 'Ethereum Mainnet',
				}),
			}),
		}))
		const debug = (
			(globalThis as typeof globalThis & {
				__blockheadE2eDebug?: Record<string, unknown>
			}).__blockheadE2eDebug?.['useEntity:Network:[{"chainId":1},1]']
		) as {
			idKey: string
			loadDebug?: unknown
			selectedFields: Record<string, unknown>
		}
		console.info(JSON.stringify({
			idKey: debug.idKey,
			loadDebug: debug.loadDebug,
			selectedFields: Object.keys(debug.selectedFields).sort(),
		}, null, 2))
		expect(debug.selectedFields.name).toBe('Ethereum Mainnet')
		expect(debug.selectedFields.environment).toBe('Mainnet')
	})
})
