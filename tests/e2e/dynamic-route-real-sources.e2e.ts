import { expect, test } from '@playwright/test'

import {
	assertMainSettled,
	expectMainVisible,
	getPersistenceProbeEvents,
	installChainlistRpcsJsonStub,
	installPersistenceProbe,
	jsonStringifyForExpectMessage,
	setupPageRuntimeDiagnostics,
	type PersistedCollectionLoadEvent,
} from '../_e2eBrowserHelpers.ts'

import { discoverFilteredPathnamesFromRoutes } from './_routeDiscovery.ts'


const probePath = process.env.E2E_PROBE_PATH?.trim()
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

	const pathnames = (await discoverFilteredPathnamesFromRoutes())
		.filter((pathname) => liveBackedDynamicRoutePattern.test(pathname))
	if (pathnames.length === 0)
		throw new Error('No filtered routes matched live-backed dynamic route source coverage')
	return pathnames
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
				window.__blockheadWaSqliteVfsNameOverride = databaseName.replace(/[^a-zA-Z0-9_-]/g, '_')
				window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
			}, {
				databaseName: `blockhead-real-source-route-${testInfo.workerIndex}-${testInfo.retry}-${testInfo.repeatEachIndex}-${index}-${Date.now()}.sqlite`,
				schemaVersion: Date.now(),
			})
			await installChainlistRpcsJsonStub(page)
			const diagnostics = setupPageRuntimeDiagnostics(page)

			await diagnostics.step(page.goto(pathname, {
				waitUntil: 'domcontentloaded',
				timeout: 120_000,
			}))
			await expectMainVisible(page, 120_000, diagnostics)
			await assertMainSettled(page, 120_000, diagnostics)
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
