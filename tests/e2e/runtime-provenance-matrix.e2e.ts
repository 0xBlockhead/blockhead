import { expect, test } from '@playwright/test'

import {
	expectMainVisible,
	installChainlistRpcsJsonStub,
} from '../_e2eBrowserHelpers.ts'
import { nostrNetworkSeedRelays } from '$/constants/Social/Nostr.ts'
import { swarmDocsLandingReference } from '$/sources/Swarm/Rest/constants.ts'
import { installRouteViewSqliteIsolation } from './_routeViewFixtures.ts'


test.setTimeout(240_000)

test.beforeEach(async ({ page }, testInfo) => {
	await installRouteViewSqliteIsolation(page, `blockhead-runtime-provenance-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`)
	await installChainlistRpcsJsonStub(page)
})

test('social, governance, and storage routes retain visible outcomes and provider provenance', async ({ page }) => {
	for (const {
		family,
		pathname,
		providerRequest,
		source,
		forceProviderFailure,
	} of [
		{
			family: 'social',
			pathname: `/nostr/relay/${encodeURIComponent(nostrNetworkSeedRelays[0].relayUrl)}`,
			providerRequest: /relay\.damus\.io/,
			source: 'NostrRelay',
			forceProviderFailure: false,
		},
		{
			family: 'governance',
			pathname: '/network/cosmos/governance/proposal/1',
			providerRequest: /cosmos|cosmoshub/i,
			source: 'CosmosSdk_Rest',
			forceProviderFailure: true,
		},
		{
			family: 'storage',
			pathname: `/swarm/${swarmDocsLandingReference}`,
			providerRequest: /bzz\.link/,
			source: 'Swarm_Rest',
			forceProviderFailure: true,
		},
	] as const) {
		const providerRequests: string[] = []
		page.on('request', (request) => providerRequests.push(request.url()))
		page.on('websocket', (webSocket) => providerRequests.push(webSocket.url()))
		if (forceProviderFailure)
			await page.route('**/*', async (route) => {
				if (
					['fetch', 'xhr'].includes(route.request().resourceType())
					&& providerRequest.test(route.request().url())
				)
					await route.fulfill({
						status: 502,
						body: `${source} provider-tolerant acceptance failure`,
					})
				else
					await route.continue()
			})

		await test.step(family, async () => {
			await page.goto(pathname, {
				waitUntil: 'load',
				timeout: 120_000,
			})
			await expectMainVisible(page, 120_000)
			const main = page.locator('#main')
			const provenance = main.locator('dt', { hasText: /^Source$/ }).locator('..').filter({ hasText: source }).first()
			const explicitFailure = main.locator('[data-resource-state="failed"]').first()
			await expect(provenance.or(explicitFailure)).toBeAttached({ timeout: 180_000 })
			await expect.poll(
				() => providerRequests.some((url) => providerRequest.test(url)),
				{
					message: `${family} route did not execute its declared provider transport`,
					timeout: 180_000,
				}
			).toBe(true)
			if (await provenance.count() === 0)
				await expect(explicitFailure).toHaveAttribute('role', 'alert')
		})
	}
})
