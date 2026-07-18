import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

import {
	assertMainSettled,
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../tests/_e2eBrowserHelpers.ts'
import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from '../../../../../tests/e2e/_routeViewDiagnostics.ts'

const farcasterCast = (
	fid: number,
	hash: `0x${string}`,
	text: string
) => ({
	hash,
	author: {
		fid,
		username: `user-${fid}`,
	},
	text,
	timestamp: '2026-07-16T12:00:00.000Z',
})

const installNeynarContinuationFixture = async (
	page: Page
) => {
	await page.route('**/*', async (route) => {
		const url = decodeURIComponent(route.request().url())
		if (url.includes('api.neynar.com/v2/farcaster/cast/')) {
			await route.fulfill({
				json: {
					cast: farcasterCast(1, '0x1111', 'First continuation cast'),
				},
			})
			return
		}
		if (!url.includes('api.neynar.com/v2/farcaster/feed/')) {
			await route.continue()
			return
		}

		await route.fulfill({
			json: (
				url.includes('cursor=next-page') ?
					{
						casts: [
							farcasterCast(2, '0x2222', 'Second continuation cast'),
						],
						next: {
							cursor: null,
						},
					}
				:
					{
						casts: [
							farcasterCast(1, '0x1111', 'First continuation cast'),
						],
						next: {
							cursor: 'next-page',
						},
					}
			),
		})
	})
}


test('Farcaster trending feed opens meaningful live cast content', async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test * 2)
	page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
	const {
		diagnostics,
		flushArtifacts,
		step,
	} = setupRouteViewSmokePage(page)

	try {
		await page.addInitScript(({ name, schemaVersion }) => {
			window.__blockheadClientProbeEnabled = true
			window.__blockheadWaSqliteDatabaseNameOverride = name
			window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
			window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
		}, {
			name: `blockhead-farcaster-live-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
			schemaVersion: Date.now(),
		})
		await installChainlistRpcsJsonStub(page)
		await installNeynarContinuationFixture(page)
		await step(page.goto('/farcaster/feed/trending', {
			waitUntil: 'load',
			timeout: routeViewSmokeTimeoutsMs.goto,
		}))
		await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
		await step(assertMainSettled(
			page,
			routeViewSmokeTimeoutsMs.mainSelector,
			diagnostics,
			{
				requiredText: ['Farcaster trending casts'],
				minimumEntityRows: 1,
				minimumLinks: 1,
			}
		))

		const castLink = page.locator('#main a[href^="/farcaster/cast/"]').first()
		await step(expect(castLink).toBeVisible())
		await step(castLink.click())
		await step(expect(page).toHaveURL(/\/farcaster\/cast\/\d+\/0x[0-9a-f]+\/?$/i))
		await step(assertMainSettled(
			page,
			routeViewSmokeTimeoutsMs.mainSelector,
			diagnostics,
			{
				minimumDt: 2,
				minimumLinks: 1,
			}
		))
		await step(expect(page.locator('#main [data-error]')).toHaveCount(0))
		await step(expect(page.locator('#main')).not.toContainText('[object Object]'))
	}
	catch (error) {
		await flushArtifacts(testInfo)
		throw error
	}
})

test('Farcaster continuation appends a terminal page without duplicate casts', async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test * 2)
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-farcaster-continuation-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
	await installNeynarContinuationFixture(page)
	await page.goto('/farcaster/feed/trending', {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	await expect(page.getByText('First continuation cast').first()).toBeVisible({
		timeout: routeViewSmokeTimeoutsMs.settle,
	})
	await page.getByRole('button', {
		name: 'Load more',
	}).click()
	await expect(page.getByText('Second continuation cast').first()).toBeVisible({
		timeout: routeViewSmokeTimeoutsMs.settle,
	})
	await expect(page.getByText('First continuation cast')).toHaveCount(1)
	await expect(page.getByText('Second continuation cast')).toHaveCount(1)
	await expect(page.getByRole('button', {
		name: 'Load more',
	})).toHaveCount(0)
})
