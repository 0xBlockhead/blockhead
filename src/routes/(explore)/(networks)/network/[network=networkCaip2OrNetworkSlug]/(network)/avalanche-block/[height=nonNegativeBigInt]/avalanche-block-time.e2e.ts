import { expect, test } from '@playwright/test'

import bindings from '$/sources/AvalanchePlatformVm/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'


const blockHeight = 7_800_000
const blockId = 'hVKgUvsn2T4pgdy2dkt1JV3hkhtAnGDPQbo8hjohWMu5E2UUa'
const blockPath = `/network/avalanche-p-chain/avalanche-block/${blockHeight}`
const platformVmProxyRoute = new RegExp(
	`/api-proxy/${encodeURIComponent(sourceBindingId(bindings[Source.AvalanchePlatformVm_JsonRpc][0]))}/0/`
)


test.setTimeout(180_000)

test.beforeEach(async ({ context }, testInfo) => {
	await context.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-avalanche-block-time-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})

test('renders the canonical P-Chain block time from the modern JSON block envelope', async ({ page }) => {
	const requests: string[] = []
	const unexpectedRequests: string[] = []
	const pageErrors: string[] = []
	page.on('pageerror', (error) => pageErrors.push(error.message))

	await page.route('**/api-proxy/**', async (route) => {
		const request = route.request()
		const requestBody = JSON.parse(request.postData() ?? '{}')
		if (
			platformVmProxyRoute.test(request.url())
			&& request.method() === 'POST'
			&& requestBody.method === 'platform.getBlockByHeight'
			&& requestBody.params?.height === blockHeight
			&& requestBody.params?.encoding === 'json'
		) {
			requests.push(requestBody.method)
			await route.fulfill({
				json: {
					jsonrpc: '2.0',
					id: requestBody.id,
					result: {
						block: {
							time: 1692009679,
							txs: [],
							parentID: 'QyqKPKGELcovAC8bF4oMurgU9K6dB5EbkzziVH1hdoahnoL9H',
							height: blockHeight,
							id: blockId,
						},
						encoding: 'json',
					},
				},
			})
			return
		}

		unexpectedRequests.push(`${request.method()} ${decodeURIComponent(request.url())}`)
		await route.fulfill({
			body: 'Unexpected Avalanche block fixture request',
			status: 418,
		})
	})

	await page.goto(blockPath, { waitUntil: 'domcontentloaded' })
	await expect(page.locator('#main')).toBeVisible({ timeout: 120_000 })
	await expect(page.locator('#main').getByText(blockHeight.toLocaleString(), { exact: true }).first()).toBeAttached({
		timeout: 120_000,
	})
	await expect(page.locator('#main time[datetime="2023-08-14T10:41:19.000Z"]')).toBeAttached()

	expect(requests.length).toBeGreaterThan(0)
	expect(new Set(requests)).toEqual(new Set(['platform.getBlockByHeight']))
	expect(unexpectedRequests).toEqual([])
	expect(pageErrors).toEqual([])
})
