import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../tests/_e2eBrowserHelpers.ts'
import {
	routeViewSmokeTimeoutsMs,
	setupRouteViewSmokePage,
} from '../../../../../tests/e2e/_routeViewDiagnostics.ts'
import bindings from '$/sources/Mastodon/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { sourceBindingId } from '$/sources/SourceBinding.ts'
import { installRouteViewSqliteIsolation } from '../../../../../tests/e2e/_routeViewFixtures.ts'


const instanceOrigin = 'https://mastodon.social'
const localAccountId = '109876543210'
const localStatusId = '112233445566'
const actorPath = `/activitypub/actor/${encodeURIComponent(instanceOrigin)}/${localAccountId}`
const actorNotesPath = `${actorPath}/notes`
const notePath = `/activitypub/note/${encodeURIComponent(instanceOrigin)}/${localStatusId}`
const threadPath = `${notePath}/thread`
const profileUrl = `${instanceOrigin}/@protocolgardener`
const activityStreamsUri = `${instanceOrigin}/users/protocolgardener`
const mastodonSocialProxyRoute = new RegExp(`/api-proxy/${encodeURIComponent(sourceBindingId(bindings[Source.Mastodon_Rest][0]))}/0/`)

const account = {
	id: localAccountId,
	username: 'protocolgardener',
	acct: 'protocolgardener',
	display_name: 'Protocol Gardener',
	note: '<p>Growing interoperable social protocols.</p>',
	url: profileUrl,
	uri: activityStreamsUri,
	created_at: '2024-04-05T12:00:00.000Z',
	followers_count: 42,
	following_count: 7,
	statuses_count: 1,
}

const status = {
	id: localStatusId,
	account,
	content: '<p>ActivityPub works best when identity remains portable.</p>',
	created_at: '2026-07-20T18:30:00.000Z',
	media_attachments: [],
	sensitive: false,
	spoiler_text: '',
	uri: `${activityStreamsUri}/statuses/${localStatusId}`,
	url: `${profileUrl}/${localStatusId}`,
	visibility: 'public',
}


test.beforeEach(async ({ page }, testInfo) => {
	testInfo.setTimeout(routeViewSmokeTimeoutsMs.test)
	page.setDefaultNavigationTimeout(routeViewSmokeTimeoutsMs.goto)
	await installRouteViewSqliteIsolation(page, testInfo, 'activitypub-actor')
	await installChainlistRpcsJsonStub(page)
})


test('Mastodon actor details lead to transport-discovered authored notes', async ({ page }, testInfo) => {
	const {
		diagnostics,
		flushArtifacts,
		step,
	} = setupRouteViewSmokePage(page)
	const mastodonRequests: string[] = []
	const unexpectedProviderRequests: string[] = []
	const consoleErrors: string[] = []
	const pageErrors: string[] = []
	page.on('console', (message) => {
		if (message.type() === 'error')
			consoleErrors.push(message.text())
	})
	page.on('pageerror', (error) => pageErrors.push(error.message))
	await page.route(mastodonSocialProxyRoute, async (route) => {
		const providerUrl = new URL(decodeURIComponent(new URL(route.request().url()).pathname.split('/').at(-1) ?? ''))
		expect(route.request().method()).toBe('GET')
		mastodonRequests.push(providerUrl.pathname)

		if (providerUrl.pathname === `/api/v1/accounts/${localAccountId}`) {
			await route.fulfill({
				contentType: 'application/json',
				json: account,
			})
			return
		}

		if (providerUrl.pathname === `/api/v1/accounts/${localAccountId}/statuses`) {
			expect(providerUrl.searchParams.get('limit')).not.toBeNull()
			await route.fulfill({
				contentType: 'application/json',
				json: [status],
			})
			return
		}
		if (providerUrl.pathname === '/api/v2/search') {
			expect(providerUrl.searchParams.get('q')).toBe(status.uri)
			expect(providerUrl.searchParams.get('resolve')).toBe('true')
			expect(providerUrl.searchParams.get('type')).toBe('statuses')
			await route.fulfill({
				contentType: 'application/json',
				json: {
					accounts: [],
					hashtags: [],
					statuses: [status],
				},
			})
			return
		}

		unexpectedProviderRequests.push(providerUrl.pathname)
		await route.fulfill({
			status: 501,
			contentType: 'application/json',
			json: {
				error: `Unexpected Mastodon operation: ${providerUrl.pathname}`,
			},
		})
	})

	try {
		await step(page.goto(actorPath, {
			waitUntil: 'load',
			timeout: routeViewSmokeTimeoutsMs.goto,
		}))
		await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
		await step(expect.poll(
			() => mastodonRequests,
			{ timeout: routeViewSmokeTimeoutsMs.mainSelector }
		).toEqual(expect.arrayContaining([
			`/api/v1/accounts/${localAccountId}`,
			`/api/v1/accounts/${localAccountId}/statuses`,
		])))
		await step(assertMainSettled(
			page,
			routeViewSmokeTimeoutsMs.mainSelector,
			diagnostics,
			{
				requiredText: [
					'Protocol Gardener',
					'Growing interoperable social protocols.',
					'ActivityPub works best when identity remains portable.',
				],
				minimumEntityRows: 1,
				minimumLinks: 3,
			}
		))

		const main = page.locator('#main')
		await step(expect(main.getByRole('link', { name: /Protocol Gardener/ }).first()).toHaveAttribute('href', actorPath))
		await step(expect(main.locator(`a[href="${profileUrl}"]`)).toHaveAttribute('rel', 'noreferrer noopener'))
		await step(expect(main.locator(`a[href="${activityStreamsUri}"]`)).toHaveAttribute('target', '_blank'))
		await step(expect(main.locator(`a[href="${notePath}"]`)).toContainText('ActivityPub works best when identity remains portable.'))
		await step(expect(main.locator('[data-error], [role="alert"]')).toHaveCount(0))
		await step(expect(main).not.toContainText('[object Object]'))

		await step(main.locator(`a[href="${actorNotesPath}"]`).first().click())
		await step(expect(page).toHaveURL(actorNotesPath))
		await step(expect(main.locator('article#notes[data-card][data-scroll-container]')).toBeVisible())
		await step(expect(main.locator(`a[href="${notePath}"]`)).toContainText('ActivityPub works best when identity remains portable.'))
		await step(expect(main.locator('[data-error], [role="alert"]')).toHaveCount(0))

		expect(unexpectedProviderRequests).toEqual([])
		expect(mastodonRequests).toEqual(expect.arrayContaining([
			`/api/v1/accounts/${localAccountId}`,
			`/api/v1/accounts/${localAccountId}/statuses`,
		]))
		expect(consoleErrors).toEqual([])
		expect(pageErrors).toEqual([])
	}
	catch (error) {
		await flushArtifacts(testInfo)
		throw error
	}
})

test('Mastodon note context renders canonical thread observations in the native thread route', async ({ page }, testInfo) => {
	const {
		diagnostics,
		flushArtifacts,
		step,
	} = setupRouteViewSmokePage(page)
	const mastodonRequests: string[] = []
	const unexpectedProviderRequests: string[] = []
	const consoleErrors: string[] = []
	const pageErrors: string[] = []
	page.on('console', (message) => {
		if (message.type() === 'error')
			consoleErrors.push(message.text())
	})
	page.on('pageerror', (error) => pageErrors.push(error.message))
	await page.route(mastodonSocialProxyRoute, async (route) => {
		const providerUrl = new URL(decodeURIComponent(new URL(route.request().url()).pathname.split('/').at(-1) ?? ''))
		expect(route.request().method()).toBe('GET')
		mastodonRequests.push(providerUrl.pathname)

		if (providerUrl.pathname === `/api/v1/statuses/${localStatusId}`) {
			await route.fulfill({
				contentType: 'application/json',
				json: status,
			})
			return
		}

		if (providerUrl.pathname === `/api/v1/statuses/${localStatusId}/context`) {
			await route.fulfill({
				contentType: 'application/json',
				json: {
					ancestors: [{
						id: '112233445565',
						uri: 'https://remote.example/users/protocolparent/statuses/112233445565',
						content: '<p>Portable identity keeps the thread connected.</p>',
						created_at: '2026-07-20T18:29:00.000Z',
						sensitive: false,
						spoiler_text: '',
						account: {
							id: 'remote-parent-cache',
							uri: 'https://remote.example/users/protocolparent',
							acct: 'protocolparent@remote.example',
						},
						favourites_count: 2,
					}],
					descendants: [{
						id: '112233445567',
						uri: 'https://mastodon.social/users/protocolreply/statuses/112233445567',
						content: '<p>And the reply carries its source observation.</p>',
						created_at: '2026-07-20T18:31:00.000Z',
						sensitive: false,
						spoiler_text: '',
						account: {
							id: 'local-reply-cache',
							uri: 'https://mastodon.social/users/protocolreply',
							acct: 'protocolreply',
						},
						replies_count: 1,
					}],
				},
			})
			return
		}

		unexpectedProviderRequests.push(providerUrl.pathname)
		await route.fulfill({
			status: 501,
			contentType: 'application/json',
			json: {
				error: `Unexpected Mastodon operation: ${providerUrl.pathname}`,
			},
		})
	})

	try {
		await step(page.goto(threadPath, {
			waitUntil: 'load',
			timeout: routeViewSmokeTimeoutsMs.goto,
		}))
		await expectMainVisible(page, routeViewSmokeTimeoutsMs.mainSelector, diagnostics)
		await step(expect.poll(
			() => mastodonRequests,
			{ timeout: routeViewSmokeTimeoutsMs.mainSelector }
		).toEqual(expect.arrayContaining([
			`/api/v1/statuses/${localStatusId}`,
			`/api/v1/statuses/${localStatusId}/context`,
		])))
		await step(assertMainSettled(
			page,
			routeViewSmokeTimeoutsMs.mainSelector,
			diagnostics,
			{
				requiredText: [
					'Portable identity keeps the thread connected.',
					'And the reply carries its source observation.',
				],
				minimumEntityRows: 2,
				minimumLinks: 2,
			}
		))

		const main = page.locator('#main')
		await step(expect(main.locator('[data-error], [role="alert"]')).toHaveCount(0))
		await step(expect(main).not.toContainText('[object Object]'))
		expect(unexpectedProviderRequests).toEqual([])
		expect(consoleErrors).toEqual([])
		expect(pageErrors).toEqual([])
	}
	catch (error) {
		await flushArtifacts(testInfo)
		throw error
	}
})
