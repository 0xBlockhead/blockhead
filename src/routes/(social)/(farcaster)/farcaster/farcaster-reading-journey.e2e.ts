import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../tests/_e2eBrowserHelpers.ts'
import { routeViewSmokeTimeoutsMs } from '../../../../../tests/e2e/_routeViewDiagnostics.ts'


const castHash = '0x1111111111111111111111111111111111111111'
const replyHash = '0x2222222222222222222222222222222222222222'

const author = {
	fid: 101,
	username: 'protocol-reader',
	display_name: 'Protocol Reader',
	profile: {
		bio: {
			text: 'Reads and explains open social protocols.',
		},
	},
	verified_addresses: {
		eth_addresses: [],
		sol_addresses: [],
	},
}

const cast = {
	hash: castHash,
	author,
	text: 'A deterministic Farcaster reading journey.',
	timestamp: '2026-07-20T12:00:00.000Z',
	channel: {
		id: 'protocol',
		name: 'Protocol',
	},
	embeds: [],
	mentioned_profiles: [],
	mentioned_channels: [],
}

const reply = {
	hash: replyHash,
	author: {
		fid: 202,
		username: 'reply-reader',
		display_name: 'Reply Reader',
	},
	text: 'A direct reply keeps the thread readable.',
	timestamp: '2026-07-20T12:01:00.000Z',
	embeds: [],
	mentioned_profiles: [],
	mentioned_channels: [],
}


test('feed, cast, author, channel, and replies form a canonical reading journey', async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test * 3)
	const consoleErrors: string[] = []
	const pageErrors: string[] = []
	const neynarProxyRequests: string[] = []
	page.on('console', (message) => {
		if (message.type() === 'error')
			consoleErrors.push(message.text())
	})
	page.on('pageerror', (error) => pageErrors.push(error.message))

	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-farcaster-reading-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
	await page.route('**/*', async (route) => {
		const sourceUrl = decodeURIComponent(route.request().url())
		if (sourceUrl.includes('/api-proxy/Snapchain_Rest-')) {
			if (![
				'/v1/userDataByFid',
				'/v1/userNameProofsByFid',
				'/v1/verificationsByFid',
				'/v1/castsByFid',
			].some((path) => sourceUrl.includes(path))) {
				await route.fallback()
				return
			}
			await route.fulfill({
				json: sourceUrl.includes('/v1/userDataByFid') ?
					{
						messages: [
							{
								data: {
									userDataBody: {
										type: 'USER_DATA_TYPE_DISPLAY',
										value: author.display_name,
									},
								},
							},
							{
								data: {
									userDataBody: {
										type: 'USER_DATA_TYPE_BIO',
										value: author.profile.bio.text,
									},
								},
							},
						],
					}
				: sourceUrl.includes('/v1/userNameProofsByFid') ?
					{ proofs: [{ name: author.username }] }
				:
					{ messages: [] },
			})
			return
		}
		if (!sourceUrl.includes('/api-proxy/Neynar_Rest-')) {
			await route.fallback()
			return
		}

		neynarProxyRequests.push(sourceUrl)

		if (sourceUrl.includes('/v2/farcaster/feed/')) {
			await route.fulfill({
				json: {
					casts: [cast],
					next: {
						cursor: null,
					},
				},
			})
			return
		}

		if (sourceUrl.includes('/v2/farcaster/cast/conversation/')) {
			await route.fulfill({
				json: {
					conversation: {
						cast: {
							...cast,
							direct_replies: [reply],
						},
					},
				},
			})
			return
		}

		if (sourceUrl.includes('/v2/farcaster/cast/')) {
			await route.fulfill({
				json: {
					cast,
				},
			})
			return
		}

		if (sourceUrl.includes('/v2/farcaster/user/bulk/')) {
			await route.fulfill({
				json: {
					users: [author],
				},
			})
			return
		}

		await route.abort('blockedbyclient')
	})

	await page.goto('/farcaster/feed/trending', {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector)

	const feedCards = page.locator('#main article[data-card][data-scroll-container]', {
		has: page.getByRole('heading', {
			name: /Farcaster trending casts/,
		}),
	})
	await expect(feedCards).toHaveCount(1)
	const castLink = feedCards.locator(`a[href="/farcaster/cast/101/${castHash}"]`).first()
	await expect(castLink).toContainText('A deterministic Farcaster reading journey.', {
		timeout: routeViewSmokeTimeoutsMs.settle,
	})
	await castLink.click()

	await expect(page).toHaveURL(`/farcaster/cast/101/${castHash}`)
	await expect(page.locator('#main')).toContainText('A deterministic Farcaster reading journey.')
	await expect(page.locator('#main')).toContainText('A direct reply keeps the thread readable.')
	await expect(page.locator('#main a[href="/farcaster/user/101"]')).toContainText('101')
	await expect(page.locator('#main dt', {
		hasText: 'Channel',
	})).toBeAttached()
	await expect(page.locator('#main a[href="/farcaster/channel/protocol"]')).toBeAttached()
	await expect(page.locator('#main [data-error], #main [role="alert"]')).toHaveCount(0)

	await page.locator('#main a[href="/farcaster/user/101"]').first().click()
	await expect(page).toHaveURL('/farcaster/user/101')
	await expect(page.locator('#main')).toContainText('Protocol Reader')
	await expect(page.locator('#main')).toContainText('Reads and explains open social protocols.')

	await page.goto('/farcaster/channel/protocol', {
		waitUntil: 'load',
		timeout: routeViewSmokeTimeoutsMs.goto,
	})
	await expect(page).toHaveURL('/farcaster/channel/protocol')
	await expect(page.locator('#main')).toContainText('protocol')
	await expect(page.locator(`#main a[href="/farcaster/cast/101/${castHash}"]`)).toContainText('A deterministic Farcaster reading journey.')
	await expect(page.locator('#main [data-error], #main [role="alert"]')).toHaveCount(0)

	expect(neynarProxyRequests.some((url) => url.includes('/v2/farcaster/feed/'))).toBe(true)
	expect(neynarProxyRequests.some((url) => url.includes('/v2/farcaster/cast/?'))).toBe(true)
	expect(neynarProxyRequests.some((url) => url.includes('/v2/farcaster/cast/conversation/?'))).toBe(true)
	expect(neynarProxyRequests.some((url) => url.includes('/v2/farcaster/user/bulk/?'))).toBe(true)
	expect(pageErrors).toEqual([])
	expect(consoleErrors).toEqual([])
})
