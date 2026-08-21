import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../../../../../../../../tests/_e2eBrowserHelpers.ts'
import bindings from '$/sources/Mastodon/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	SourceTargetKind,
	sourceBindingId,
} from '$/sources/SourceBinding.ts'


const mastodonSocialBinding = bindings[Source.Mastodon_Rest].find(({ target }) => (
	target.kind === SourceTargetKind.Global
	&& target.key === 'mastodon-instance:https://mastodon.social'
))
if (mastodonSocialBinding == null)
	throw new Error('Mastodon moderation fixture requires the mastodon.social instance binding')

const mastodonSocialProxyRoute = new RegExp(
	`/api-proxy/${encodeURIComponent(sourceBindingId(mastodonSocialBinding))}/0/`
)


test('an undisclosed Mastodon moderation list does not mask the visible instance snapshot', async ({ page }, testInfo) => {
	test.setTimeout(180_000)
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `bh-mum-${testInfo.workerIndex}-${testInfo.retry}-${testInfo.repeatEachIndex}.sqlite`,
		schemaVersion: Date.now(),
	})
	await installChainlistRpcsJsonStub(page)
	const mastodonRequests: string[] = []
	await page.route(mastodonSocialProxyRoute, async (route) => {
		const providerUrl = new URL(decodeURIComponent(
			new URL(route.request().url()).pathname.split('/').at(-1) ?? ''
		))
		mastodonRequests.push(providerUrl.pathname)
		if (providerUrl.pathname === '/api/v1/instance/domain_blocks') {
			await route.fulfill({ status: 403, body: 'undisclosed' })
			return
		}
		if (providerUrl.pathname === '/api/v1/instance/peers') {
			await route.fulfill({ json: [] })
			return
		}
		if (providerUrl.pathname === '/api/v1/instance') {
			await route.fulfill({
				json: {
					description: 'Snapshot stays visible when moderation is undisclosed.',
					title: 'Undisclosed moderation fixture',
					version: '4.4.0',
				},
			})
			return
		}
		await route.fulfill({ status: 404, body: 'unexpected Mastodon operation' })
	})

	await page.goto('/activitypub/instance/https%3A%2F%2Fmastodon.social', {
		waitUntil: 'load',
	})
	await expectMainVisible(page)
	const main = page.locator('#main')
	await expect(main).toContainText('Undisclosed moderation fixture', { timeout: 120_000 })
	expect(mastodonRequests).toEqual(expect.arrayContaining([
		'/api/v1/instance',
		'/api/v1/instance/domain_blocks',
	]))
	await expect(main).not.toContainText('Moderated domains')
	await expect(main.locator('[data-error]')).toHaveCount(0)
})
