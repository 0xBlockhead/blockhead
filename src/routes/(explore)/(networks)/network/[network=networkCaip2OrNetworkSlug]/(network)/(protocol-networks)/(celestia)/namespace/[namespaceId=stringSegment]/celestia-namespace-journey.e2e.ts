import { expect, test } from '@playwright/test'

import bindings from '$/sources/Celenium/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'


const namespaceId = `00${'a'.repeat(56)}`
const namespacePath = `/network/celestia/namespace/${namespaceId}`
const timestampMs = Date.parse('2026-07-23T04:48:00Z')
const commitment = `${'B'.repeat(43)}=`
const observationPath = `${namespacePath}/observations/${timestampMs}/${Source.Celenium_Rest}`
const blobPath = `${namespacePath}/blob/12424720/${commitment}`
const celeniumProxyRoute = new RegExp(
	`/api-proxy/${encodeURIComponent(sourceBindingId(bindings[Source.Celenium_Rest][0]))}/0/`
)


test.setTimeout(180_000)

test.beforeEach(async ({ context }, testInfo) => {
	await context.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-celestia-namespace-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})

test('namespace links its source observation and blob detail', async ({ page }) => {
	const requests: string[] = []
	const unexpectedRequests: string[] = []
	await page.route(celeniumProxyRoute, async (route) => {
		const request = route.request()
		const providerUrl = new URL(decodeURIComponent(
			new URL(request.url()).pathname.split('/').at(-1) ?? ''
		))
		requests.push(`${request.method()} ${providerUrl.pathname}${providerUrl.search}`)

		if (request.method() === 'GET' && providerUrl.pathname === `/v1/namespace/${'a'.repeat(56)}/0`) {
			await route.fulfill({
				json: {
					size: 24_857,
					blobs_count: 1,
					version: 0,
					namespace_id: 'a'.repeat(56),
					hash: `${'A'.repeat(39)}=`,
					last_height: 12_424_720,
					last_message_time: '2026-07-23T04:48:00Z',
					name: 'PayForBlobs',
					reserved: false,
				},
			})
			return
		}

		if (request.method() === 'GET' && providerUrl.pathname.endsWith('/blobs')) {
			await route.fulfill({
				json: [{
					commitment,
					size: 379,
					share_version: 0,
					height: 12_424_720,
					time: '2026-07-23T04:48:00Z',
					content_type: 'application/octet-stream',
					tx_hash: 'a'.repeat(64),
					signer: {
						hash: 'celestia1zwpvejau8kzhttlc39wmfggyf8n3eaxlpvd86u',
					},
				}],
			})
			return
		}

		unexpectedRequests.push(`${request.method()} ${providerUrl.pathname}${providerUrl.search}`)
		await route.fulfill({
			status: 418,
			body: 'Unexpected Celenium fixture request',
		})
	})

	await page.goto(namespacePath, { waitUntil: 'domcontentloaded' })
	await expect(page.locator('#main')).toContainText('PayForBlobs', { timeout: 120_000 })
	await expect(page.locator(`#main a[href="${observationPath}"]`)).toBeAttached()
	await expect(page.locator(`#main a[href="${blobPath}"]`)).toBeAttached()
	expect(requests.length).toBeGreaterThan(0)
	expect(unexpectedRequests).toEqual([])
})
