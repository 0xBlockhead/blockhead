import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

import {
	assertMainSettled,
	collectIssues,
	installChainlistRpcsJsonStub,
	installPersistenceProbe,
	type PersistedCollectionSyncEvent,
} from '../_e2eBrowserHelpers.ts'

const pageErrors = (issues: string[]) => (
	issues.filter((i) => i.startsWith('pageerror:'))
)

const readBlocksDiagnostics = (
	page: Page
) => page.evaluate(() => {
	const probe = window.__blockheadClientProbe
	if (probe == null)
		throw new Error('missing blockhead client probe')

	return {
		fieldRows: probe.collectionSizes().fields.EvmNetwork.$$blocks,
		queries: probe.queryStates().filter((query) => query.key[0] === 'Field:EvmNetwork:$$blocks'),
	}
})

const readFieldSyncs = (
	page: Page
) => page.evaluate(() => {
	const probe = window.__blockheadClientProbe
	if (probe == null)
		throw new Error('missing blockhead client probe')

	return probe.events.collectionSync.flatMap((event: PersistedCollectionSyncEvent) => (
		event.collection.kind === 'Field' ?
			[{
				entityType: event.collection.entityType,
				fieldName: event.collection.fieldName,
			}]
		:
			[]
	))
})

const assertOnlyRouteOwnedEvmNetworkFields = async (
	page: Page,
	routeOwnedFieldName: string
) => {
	const fieldNames = (await readFieldSyncs(page)).flatMap((fieldSync) => (
		fieldSync.entityType === 'EvmNetwork' ?
			[fieldSync.fieldName]
		:
			[]
	))
	expect(fieldNames).toContain(routeOwnedFieldName)
	expect(fieldNames.filter((fieldName) => (
		fieldName !== routeOwnedFieldName
		&& [
			'$$executionUpgrades',
			'$$gasFeeBlocks',
			'$$gasEstimateTimestamps',
			'$$txpoolTimestamps',
			'$$erc20TokenTransfers',
			'$$nftTokenTransfers',
			'$$erc4337SmartAccounts',
			'$$erc4337Bundlers',
			'$$erc4337Paymasters',
			'$$erc4337AccountFactories',
			'$$userOperations',
			'$$beaconFinalityTimestamps',
			'$$beaconCommittees',
			'$$beaconSyncCommittees',
			'$$beaconAttestations',
			'$$beaconWithdrawals',
			'$$beaconSlashings',
			'$$beaconValidators',
			'$$beaconEpochs',
			'$$beaconSlots',
			'$$mevRelays',
			'$$mevBuilders',
			'$$mevProposerPayloadDelivered',
			'$$blobs',
			'$$precompiles',
			'$$contracts',
			'$$bridges',
			'$$faucetUrls',
			'$$blockExplorerUrls',
			'$$siblingShardNetworks',
			'$$childLayers',
			'$$settledRollups',
		].includes(fieldName)
	))).toEqual([])
}

const assertNoFieldSyncs = async (
	page: Page,
	forbiddenFieldSyncs: {
		entityType: string
		fieldName: string
	}[]
) => {
	const fieldSyncs = await readFieldSyncs(page)
	expect(fieldSyncs.filter((fieldSync) => (
		forbiddenFieldSyncs.some((forbiddenFieldSync) => (
			forbiddenFieldSync.entityType === fieldSync.entityType
			&& forbiddenFieldSync.fieldName === fieldSync.fieldName
		))
	))).toEqual([])
}

const openEvmNetworkRoute = async (
	page: Page,
	pathname: string,
	options: {
		settle?: boolean
	} = {}
) => {
	await installPersistenceProbe(page)
	await installChainlistRpcsJsonStub(page)

	const cdpSession = await page.context().newCDPSession(page)
	await cdpSession.send('Storage.clearDataForOrigin', {
		origin: new URL('/', process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173').origin,
		storageTypes: 'all',
	})
	await cdpSession.detach()
	const issues = collectIssues(page)
	const requestUrls: string[] = []
	page.on('request', (request) => {
		requestUrls.push(request.url())
	})
	await page.goto(pathname, { waitUntil: 'load' })
	await expect(page.locator('#main')).toBeVisible()
	if (options.settle !== false)
		await assertMainSettled(page, 120_000)

	return { issues, requestUrls }
}

const assertNoAccountAbstractionListRequests = (
	requestUrls: string[]
) => {
	expect(requestUrls.filter((url) => (
		url.includes('/proxy/account-abstraction/accounts')
		|| url.includes('/proxy/account-abstraction/bundlers')
		|| url.includes('/proxy/account-abstraction/paymasters')
		|| url.includes('/proxy/account-abstraction/factories')
	))).toEqual([])
}

const assertNoAccountActivityRequests = (
	requestUrls: string[]
) => {
	expect(requestUrls.filter((url) => (
		url.includes('/addresses/')
		&& (
			url.includes('/token-transfers')
			|| url.includes('/internal-transactions')
		)
	))).toEqual([])
}

test.describe('EVM network nested routes only start route-owned field collections', () => {
	test('blocks route materializes $$blocks without parent summary side resources', async ({ page }) => {
		test.setTimeout(240_000)
		const {
			issues,
			requestUrls,
		} = await openEvmNetworkRoute(page, '/network/eip155:1/blocks')

		await expect.poll(async () => {
			const diagnostics = await readBlocksDiagnostics(page)
			return (
				diagnostics.fieldRows > 0
				&& diagnostics.queries.some((query) => query.status === 'success')
			) ?
				'ok'
			:
				JSON.stringify(diagnostics)
		}, {
			message: 'Field:EvmNetwork:$$blocks query must materialize rows into the TanStack DB field collection',
			timeout: 60_000,
			intervals: [
				500,
				1_000,
				2_000,
			],
		}).toBe('ok')
		expect((await readBlocksDiagnostics(page)).fieldRows).toBeGreaterThan(0)
		const firstBlockLink = page.locator('#blocks-items a[href*="/block/"]').first()
		await expect(firstBlockLink).toBeAttached()
		await expect(firstBlockLink).toHaveAttribute('href', /\/block\/[0-9]+\b/)
		await assertOnlyRouteOwnedEvmNetworkFields(page, '$$blocks')
		await assertNoFieldSyncs(page, [
			{
				entityType: 'EvmBlock',
				fieldName: '$$transactions',
			},
		])
		assertNoAccountAbstractionListRequests(requestUrls)

		expect(
			pageErrors(issues),
			pageErrors(issues).join('\n')
		).toEqual([])
	})

	test('transactions route materializes $$transactions without parent summary side resources', async ({ page }) => {
		test.setTimeout(240_000)
		const {
			issues,
			requestUrls,
		} = await openEvmNetworkRoute(page, '/network/eip155:1/transactions')

		await expect(page.locator('#transactions')).toBeVisible()
		await assertOnlyRouteOwnedEvmNetworkFields(page, '$$transactions')
		assertNoAccountAbstractionListRequests(requestUrls)
		await assertNoFieldSyncs(page, [
			{
				entityType: 'EvmNetworkAccount',
				fieldName: '$$transactions',
			},
			{
				entityType: 'EvmNetworkAccount',
				fieldName: '$$tokenTransfers',
			},
			{
				entityType: 'EvmNetworkAccount',
				fieldName: '$$internalTransfers',
			},
			{
				entityType: 'EvmNetworkAccount',
				fieldName: '$$ownedCoins',
			},
		])
		assertNoAccountActivityRequests(requestUrls)

		expect(
			pageErrors(issues),
			pageErrors(issues).join('\n')
		).toEqual([])
	})

	test('transaction detail renders account summaries without account activity side resources', async ({ page }) => {
		test.setTimeout(240_000)
		const {
			requestUrls,
		} = await openEvmNetworkRoute(
			page,
			'/network/eip155:1/tx/0x31ed178236b6bc4dd6dc8c6026e9d344e39afe0dc6d832c228131ce4ee40a8ca',
			{ settle: false }
		)

		await expect(page.locator('#main')).toBeVisible()
		await page.waitForTimeout(10_000)
		await assertNoFieldSyncs(page, [
			{
				entityType: 'EvmNetworkAccount',
				fieldName: '$$transactions',
			},
			{
				entityType: 'EvmNetworkAccount',
				fieldName: '$$tokenTransfers',
			},
			{
				entityType: 'EvmNetworkAccount',
				fieldName: '$$internalTransfers',
			},
			{
				entityType: 'EvmNetworkAccount',
				fieldName: '$$ownedCoins',
			},
		])
		assertNoAccountActivityRequests(requestUrls)
	})
})
