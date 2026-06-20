import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	expectMainVisible,
	getPersistenceProbeEvents,
	installChainlistRpcsJsonStub,
	installPersistenceProbe,
	jsonStringifyForExpectMessage,
	type PersistedCollectionLoadEvent,
} from '../_e2eBrowserHelpers.ts'

import { discoverPathnamesFromRoutes } from './_routeDiscovery.ts'


declare global {
	interface Window {
		__blockheadWaSqliteDatabaseNameOverride?: string
		__blockheadPersistedCollectionSchemaVersionOverride?: number
	}
}


const probePath = process.env.E2E_PROBE_PATH?.trim()
const pathPattern = (
	((raw) => (
		raw == null || raw === '' ?
			undefined
		:
			new RegExp(raw)
	))(process.env.E2E_PATH_PATTERN?.trim())
)

const liveBackedDynamicRoutePattern = /^\/(?:url\/|network\/(?:eip155(?:%253A|:)1\/(?:account|block|blob|contract|tx|user-operation)\/|0g(?:$|\/(?:address|blocks|channels|nodes|transactions)(?:\/|$))|(?:bitcoin|bitcoin-cash)(?:$|\/(?:address|blocks|transactions)(?:\/|$))))/

const remoteCollectionLoadsByCollection = (
	events: readonly PersistedCollectionLoadEvent[]
) => (
	events.reduce<Record<string, number>>((out, event) => {
		if (
			event.type === 'collection-load'
			&& event.decision === 'remote'
		)
			out[event.collectionId] = (out[event.collectionId] ?? 0) + 1

		return out
	}, {})
)

const nonConstantRemoteCollectionLoads = (
	events: readonly PersistedCollectionLoadEvent[]
) => (
	Object.entries(remoteCollectionLoadsByCollection(events))
		.filter(([collectionId, count]) => (
			!collectionId.startsWith('client.entities.Network')
			&& count > 0
		))
)

const routePathnames = await (async () => {
	if (probePath != null && probePath !== '')
		return [probePath]

	const all = (await discoverPathnamesFromRoutes())
		.filter((pathname) => liveBackedDynamicRoutePattern.test(pathname))
		.filter((pathname) => pathPattern?.test(pathname) ?? true)
	const limitRaw = process.env.E2E_PATH_LIMIT ?? ''
	const limit = Number(limitRaw)
	return (
		limitRaw !== '' && Number.isFinite(limit) && limit > 0 ?
			all.slice(0, limit)
		:
			all
	)
})()

test.describe('dynamic routes resolve from real sources', () => {
	test.describe.configure({ mode: 'parallel' })

	for (const [index, pathname] of routePathnames.entries()) {
		test(`${index + 1}/${routePathnames.length} ${pathname}`, async ({ page }, testInfo) => {
			testInfo.setTimeout(180_000)
			page.setDefaultNavigationTimeout(120_000)
			await installPersistenceProbe(page)
			await page.addInitScript(({ databaseName, schemaVersion }) => {
				window.__blockheadWaSqliteDatabaseNameOverride = databaseName
				window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
			}, {
				databaseName: `blockhead-real-source-route-${testInfo.workerIndex}-${testInfo.retry}-${testInfo.repeatEachIndex}-${index}-${Date.now()}.sqlite`,
				schemaVersion: Date.now(),
			})
			await installChainlistRpcsJsonStub(page)

			await page.goto(pathname, {
				waitUntil: 'domcontentloaded',
				timeout: 120_000,
			})
			await expectMainVisible(page, 120_000)
			await assertMainSettled(page, 120_000)
			await page.waitForTimeout(2_000)

			const events = await getPersistenceProbeEvents(page)
			expect(
				nonConstantRemoteCollectionLoads(events),
				`${pathname}\n${jsonStringifyForExpectMessage({
					remoteCollectionLoadsByCollection: remoteCollectionLoadsByCollection(events),
					collectionLoads: events,
				})}`
			).not.toEqual([])
		})
	}

	test('discovered live-backed dynamic routes', () => {
		test.skip(probePath != null && probePath !== '', 'E2E_PROBE_PATH probes one route')
		expect(routePathnames.length).toBeGreaterThan(0)
	})
})
