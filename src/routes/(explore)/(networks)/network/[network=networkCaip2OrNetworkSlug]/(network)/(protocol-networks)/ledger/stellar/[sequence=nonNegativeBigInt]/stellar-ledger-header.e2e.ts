import { expect, test } from '@playwright/test'

import bindings from '$/sources/StellarHorizon/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'


declare global {
	interface Window {
		__blockheadClientProbeEnabled?: boolean
		__blockheadPersistedCollectionSchemaVersionOverride?: number
		__blockheadWaSqliteDatabaseNameOverride?: string
		__blockheadWaSqliteVfsNameOverride?: string
	}
}


const ledgerSequence = 64_041_727
const ledgerHash = '37d36e0c8fe4e7500e430b404f9e9dd7a96f63e85d7d83f791f1861f96f97b71'
const ledgerPath = `/network/stellar/ledger/stellar/${ledgerSequence}`
const horizonProxyRoute = new RegExp(
	`/api-proxy/${encodeURIComponent(sourceBindingId(bindings[Source.StellarHorizon_Rest][0]))}/0/`
)


test.setTimeout(180_000)

test.beforeEach(async ({ context }, testInfo) => {
	await context.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-stellar-ledger-header-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})

test('renders an exact Horizon ledger header without live provider fallback', async ({ page }) => {
	const requests: string[] = []
	const unexpectedRequests: string[] = []
	const pageErrors: string[] = []
	page.on('pageerror', (error) => pageErrors.push(error.message))

	await page.route('**/api-proxy/**', async (route) => {
		const request = route.request()
		const decodedUrl = decodeURIComponent(request.url())
		if (
			horizonProxyRoute.test(request.url())
			&& request.method() === 'GET'
			&& decodedUrl.endsWith(`/ledgers/${ledgerSequence}`)
		) {
			requests.push('ledger-header')
			await route.fulfill({
				json: {
					id: ledgerHash,
					hash: ledgerHash,
					sequence: ledgerSequence,
					successful_transaction_count: 338,
					failed_transaction_count: 91,
					operation_count: 646,
					closed_at: '2026-08-20T12:54:47Z',
					protocol_version: 27,
				},
			})
			return
		}
		if (
			horizonProxyRoute.test(request.url())
			&& request.method() === 'GET'
			&& /\/ledgers\/64041727\/(transactions|operations|effects)\?/.test(decodedUrl)
		) {
			requests.push(decodedUrl.match(/\/(transactions|operations|effects)\?/)?.[1] ?? 'unknown')
			await route.fulfill({
				json: {
					_links: {
						next: {
							href: '',
						},
					},
					_embedded: {
						records: [],
					},
				},
			})
			return
		}

		unexpectedRequests.push(`${request.method()} ${decodedUrl}`)
		await route.fulfill({
			body: 'Unexpected Stellar ledger fixture request',
			status: 418,
		})
	})

	await page.route('https://api.stellar.expert/**', async (route) => {
		const request = route.request()
		if (
			request.method() === 'GET'
			&& request.url() === `https://api.stellar.expert/explorer/public/ledger/timestamp-from-sequence?sequence=${ledgerSequence}`
		) {
			requests.push('stellar-expert-close-time')
			await route.fulfill({
				json: {
					sequence: ledgerSequence,
					timestamp: 1_787_230_487,
					date: '2026-08-20T12:54:47Z',
				},
			})
			return
		}

		unexpectedRequests.push(`${request.method()} ${request.url()}`)
		await route.fulfill({
			body: 'Unexpected Stellar Expert fixture request',
			status: 418,
		})
	})

	await page.goto(ledgerPath, { waitUntil: 'domcontentloaded' })
	await expect(page.locator('#main')).toBeVisible({ timeout: 120_000 })
	await expect(page.locator('#main time[datetime="2026-08-20T12:54:47.000Z"]').first()).toBeAttached({
		timeout: 120_000,
	})
	await expect(page.locator('#main').getByText('27', { exact: true })).toBeAttached()
	await expect(page.locator('#main').getByText('429', { exact: true })).toBeAttached()
	await expect(page.locator('#main').getByText('646', { exact: true })).toBeAttached()
	await expect(page.locator('#main').getByText('338', { exact: true })).toBeAttached()
	await expect(page.locator('#main').getByText('91', { exact: true })).toBeAttached()

	expect(requests).toContain('ledger-header')
	expect(unexpectedRequests).toEqual([])
	expect(pageErrors).toEqual([])
})
