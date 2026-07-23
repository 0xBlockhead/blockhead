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


const instanceOrigin = 'https://mastodon.social'
const localAccountId = '109876543210'
const localStatusId = '112233445566'
const actorPath = `/activitypub/actor/${encodeURIComponent(instanceOrigin)}/${localAccountId}`
const actorNotesPath = `${actorPath}/notes`
const notePath = `/activitypub/note/${encodeURIComponent(instanceOrigin)}/${localStatusId}`
const profileUrl = `${instanceOrigin}/@protocolgardener`
const activityStreamsUri = `${instanceOrigin}/users/protocolgardener`

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
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `blockhead-activitypub-actor-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
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
	await page.route('**/api-proxy/Mastodon_Rest-*/0/**', async (route) => {
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
			{ timeout: routeViewSmokeTimeoutsMs.settle }
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
		const actorCard = main.locator('article[data-card][data-scroll-container]').first()
		await step(expect(actorCard).toBeVisible())
		await step(expect(actorCard.locator(`a[href="${actorPath}"]`)).toHaveCount(1))
		await step(expect(actorCard.locator(`a[href="${profileUrl}"]`)).toHaveAttribute('rel', 'noreferrer noopener'))
		await step(expect(actorCard.locator(`a[href="${activityStreamsUri}"]`)).toHaveAttribute('target', '_blank'))
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
