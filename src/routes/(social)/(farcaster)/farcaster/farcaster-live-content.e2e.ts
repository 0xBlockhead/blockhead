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
		const url = decodeURIComponent(decodeURIComponent(route.request().url()))
		if (
			url.includes('/v1/castById')
			&& (
				url.includes('hub.pinata.cloud')
				|| url.includes('snap.farcaster.xyz')
				|| url.includes('/api-proxy/Snapchain_Rest-')
			)
		) {
			const helperCast = url.includes('0xe4f2e1c70d72388a98dba2a2511a9b480840e544')
			await route.fulfill({
				json: {
					hash: helperCast ?
						'0xe4f2e1c70d72388a98dba2a2511a9b480840e544'
					:
						'0x1111',
					data: {
						fid: helperCast ? 3 : 1,
						timestamp: 1_700_000_000,
						castAddBody: {
							text: helperCast ? 'Snapchain fixture cast' : 'First continuation cast',
							mentions: [],
							embeds: [],
						},
					},
				},
			})
			return
		}
		if (
			url.includes('api.neynar.com/v2/farcaster/user/bulk/')
			|| (
				url.includes('/api-proxy/Neynar_Rest-')
				&& url.includes('user')
				&& url.includes('bulk')
			)
		) {
			await route.fulfill({
				json: {
					users: [
						url.includes('fids=3') ?
							{
								fid: 3,
								username: 'user-3',
								display_name: 'User 3',
							}
						:
							{
								fid: 1,
								username: 'user-1',
								display_name: 'User 1',
							},
					],
				},
			})
			return
		}
		if (
			url.includes('api.neynar.com/v2/farcaster/cast/conversation/')
			|| (
				url.includes('/api-proxy/Neynar_Rest-')
				&& url.includes('cast')
				&& url.includes('conversation')
			)
		) {
			const helperCast = url.includes('0xe4f2e1c70d72388a98dba2a2511a9b480840e544')
			await route.fulfill({
				json: {
					conversation: {
						cast: {
							...(
								helperCast ?
									farcasterCast(3, '0xe4f2e1c70d72388a98dba2a2511a9b480840e544', 'Snapchain fixture cast')
								:
									farcasterCast(1, '0x1111', 'First continuation cast')
							),
							direct_replies: [
								farcasterCast(3, '0x3333', 'Direct reply cast'),
							],
						},
					},
				},
			})
			return
		}
		if (
			url.includes('api.neynar.com/v2/farcaster/cast/')
			|| (
				url.includes('/api-proxy/Neynar_Rest-')
				&& url.includes('cast')
			)
		) {
			await route.fulfill({
				json: {
					cast: (
						url.includes('0xe4f2e1c70d72388a98dba2a2511a9b480840e544') ?
							farcasterCast(3, '0xe4f2e1c70d72388a98dba2a2511a9b480840e544', 'Snapchain fixture cast')
						:
							farcasterCast(1, '0x1111', 'First continuation cast')
					),
				},
			})
			return
		}
		if (
			!url.includes('api.neynar.com/v2/farcaster/feed/')
			&& !(
				url.includes('/api-proxy/Neynar_Rest-')
				&& url.includes('feed')
			)
		) {
			await route.fallback()
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

		await step(expect(page.getByText('Snapchain fixture cast').first()).toBeVisible())
		const castLink = page.locator('#main a[href="/farcaster/cast/3/0xe4f2e1c70d72388a98dba2a2511a9b480840e544"]').first()
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
		await step(expect(page.getByText('Direct reply cast').first()).toBeVisible())
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
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	await page.getByRole('button', {
		name: 'Load more',
	}).click()
	await expect(page.getByText('Second continuation cast').first()).toBeVisible({
		timeout: routeViewSmokeTimeoutsMs.mainSelector,
	})
	await expect(page.getByText('First continuation cast')).toHaveCount(1)
	await expect(page.getByText('Second continuation cast')).toHaveCount(1)
	await expect(page.getByRole('button', {
		name: 'Load more',
	})).toHaveCount(0)
})
