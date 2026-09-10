import type { ServerResponse } from 'node:http'
import { createServer } from 'node:http'

import { expect, test } from '@playwright/test'
import { stringify } from 'devalue'

import { expectMainVisible } from '../../../../tests/_e2eBrowserHelpers.ts'


test.setTimeout(180_000)

test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `bh-dydx-live-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})

test('RemoteLive push updates direct getter and ResourceBoundary DOM', async ({ page }) => {
	let publishBlockHeight = () => {}
	let markBlockHeightStreamReady = () => {}
	const blockHeightStreamReady = new Promise<void>((resolve) => {
		markBlockHeightStreamReady = resolve
	})
	const openResponses = new Set<ServerResponse>()
	const activeHeightResponses = new Set<ServerResponse>()
	let subscriptionAttempts = 0
	let maxConcurrentHeightStreams = 0
	const publishedEventDeliveries = new Map<number, number>()
	let publishedEvent = 0
	const send = (
		response: ServerResponse,
		message: object
	) => response.write(`data: ${JSON.stringify({
			type: 'result',
			result: stringify(message),
		})}\n\n`)
	const liveServer = createServer((request, response) => {
		response.writeHead(200, {
			'cache-control': 'private, no-store',
			'content-type': 'text/event-stream',
		})
		openResponses.add(response)
		response.on('close', () => openResponses.delete(response))

		if (request.url === '/v4_markets') {
			send(response, {
				channel: 'v4_markets',
				connection_id: 'markets-connection',
				contents: {
					markets: {},
				},
				message_id: 0,
				type: 'subscribed',
			})
			return
		}

		subscriptionAttempts += 1
		activeHeightResponses.add(response)
		maxConcurrentHeightStreams = Math.max(maxConcurrentHeightStreams, activeHeightResponses.size)
		response.on('close', () => activeHeightResponses.delete(response))
		send(response, {
			channel: 'v4_block_height',
			connection_id: 'height-connection',
			contents: {
				height: '100',
				time: '2026-08-05T17:00:00.000Z',
			},
			id: 'dydx-mainnet-1',
			message_id: 0,
			type: 'subscribed',
		})
		publishBlockHeight = () => {
			publishedEvent += 1
			publishedEventDeliveries.set(publishedEvent, activeHeightResponses.size)
			for (const activeResponse of activeHeightResponses)
				send(activeResponse, {
					channel: 'v4_block_height',
					connection_id: 'height-connection',
					contents: {
						blockHeight: String(9007199254740992n + BigInt(publishedEvent)),
						time: publishedEvent === 1 ? '2026-08-05T17:01:00.000Z' : '2026-08-05T17:02:00.000Z',
					},
					message_id: publishedEvent,
					type: 'channel_data',
					version: '1.0.0',
				})
		}
		markBlockHeightStreamReady()
	})
	await new Promise<void>((resolve) => liveServer.listen(0, '127.0.0.1', resolve))
	const liveServerAddress = liveServer.address()
	if (liveServerAddress == null || typeof liveServerAddress === 'string')
		throw new Error('dYdX live mock server did not bind a TCP port')

	try {
		await page.route('**/api-proxy/**', async (route) => {
			const url = decodeURIComponent(route.request().url())
			if (url.endsWith('/v4/height')) {
				await route.fulfill({
					json: {
						height: '100',
						time: '2026-08-05T17:00:00.000Z',
					},
				})
				return
			}
			if (url.includes('/v4/perpetualMarkets')) {
				await route.fulfill({
					json: {
						markets: {},
					},
				})
				return
			}

			await route.continue()
		})
		await page.route('**/_app/remote/**', async (route) => {
			const payload = new URL(route.request().url()).searchParams.get('payload')
			const request = payload == null ? '' : Buffer.from(payload, 'base64url').toString()
			if (
				!request.includes('cosmos:dydx-mainnet-1')
				|| !request.includes('subscribe')
			) {
				await route.continue()
				return
			}

			await route.continue({
				url: `http://127.0.0.1:${liveServerAddress.port}/${request.includes('v4_markets') ? 'v4_markets' : 'v4_block_height'}`,
			})
		})

		await page.goto('/test/dydx-live')
		await expectMainVisible(page)
		await page.locator('body').evaluate((body) => {
			body.dataset.dydxLiveRouteInstance = 'open'
		})
		await blockHeightStreamReady
		await expect(page.getByTestId('dydx-live-direct-timestamp')).toHaveText(String(Date.parse('2026-08-05T17:00:00.000Z')))
		await expect(page.getByTestId('dydx-live-boundary-timestamp')).toHaveText(String(Date.parse('2026-08-05T17:00:00.000Z')))

		publishBlockHeight()

		await expect(page.getByTestId('dydx-live-direct-timestamp')).toHaveText(String(Date.parse('2026-08-05T17:01:00.000Z')))
		await expect(page.getByTestId('dydx-live-boundary-timestamp')).toHaveText(String(Date.parse('2026-08-05T17:01:00.000Z')))
		publishBlockHeight()
		await expect(page.getByTestId('dydx-live-direct-timestamp')).toHaveText(String(Date.parse('2026-08-05T17:02:00.000Z')))
		await expect(page.getByTestId('dydx-live-boundary-timestamp')).toHaveText(String(Date.parse('2026-08-05T17:02:00.000Z')))
		expect(subscriptionAttempts).toBe(1)
		expect(maxConcurrentHeightStreams).toBe(1)
		expect(publishedEventDeliveries.get(1)).toBe(1)
		expect(publishedEventDeliveries.get(2)).toBe(1)
		await expect(page.locator('body')).toHaveAttribute('data-dydx-live-route-instance', 'open')
	} finally {
		for (const response of openResponses)
			response.end()
		await new Promise<void>((resolve, reject) => liveServer.close((error) => error == null ? resolve() : reject(error)))
	}
})
