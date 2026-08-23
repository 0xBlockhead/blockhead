import { expect, test } from '@playwright/test'

import {
	e2eProfileDatabaseName,
	e2eProfileVfsName,
} from '../../../../../../../../../../../../../../../tests/e2e/$e2eDatabaseProfile.ts'


const marketKey = 'ETH'
const interval = '1h'
const intervalValue = '1'
const intervalUnit = 'h'
const timestampMs = 1_700_000_000_000
const observationPath = `/network/hyperliquid/market/${marketKey}/interval/${intervalValue}/${intervalUnit}/observations/${timestampMs}`


test.beforeEach(async ({ page }, testInfo) => {
	await page.addInitScript(({ name, vfsName, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = vfsName
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: e2eProfileDatabaseName(`hyperliquid-market-observation-${testInfo.workerIndex}-${testInfo.retry}`),
		vfsName: e2eProfileVfsName(`hyperliquid-market-observation-${testInfo.workerIndex}-${testInfo.retry}`),
		schemaVersion: Date.now(),
	})
})


test('renders a provider-matched Hyperliquid market interval observation', async ({ page }) => {
	test.setTimeout(180_000)
	const requests: string[] = []

	await page.route('https://api.hyperliquid.xyz/info', async (route) => {
		const body = JSON.parse(route.request().postData() ?? '{}')
		requests.push(typeof body.type === 'string' ? body.type : '')

		if (body.type === 'candleSnapshot') {
			expect(body.req).toEqual({
				coin: marketKey,
				interval,
				startTime: timestampMs,
				endTime: timestampMs + 86_400_000,
			})
			await route.fulfill({
				json: [{
					t: timestampMs,
					T: timestampMs + 3_600_000,
					s: marketKey,
					i: interval,
					o: '100',
					h: '110',
					l: '90',
					c: '105',
					v: '42',
					n: 7,
				}],
			})
			return
		}

		if (body.type === 'metaAndAssetCtxs') {
			await route.fulfill({
				json: [[{
					universe: [{
						name: marketKey,
						szDecimals: 4,
						maxLeverage: 50,
					}],
				}], [{
					funding: '0',
					openInterest: '0',
					prevDayPx: '100',
					dayNtlVlm: '0',
					premium: null,
					oraclePx: '100',
					markPx: '100',
					midPx: null,
					impactPxs: null,
				}]],
			})
			return
		}

		throw new Error(`Unexpected Hyperliquid info request ${String(body.type)}`)
	})

	await page.goto(observationPath, { waitUntil: 'domcontentloaded' })
	const main = page.locator('#main')
	await expect(main).toContainText('ETH', { timeout: 120_000 })
	await expect(main).toContainText('1h')
	await expect(main).toContainText('100')
	await expect(main).toContainText('105')
	await expect(main).toContainText('7')
	await expect(main.locator('[data-error], [role="alert"]')).toHaveCount(0)
	await expect(requests).toEqual(['candleSnapshot', 'metaAndAssetCtxs'])
})
