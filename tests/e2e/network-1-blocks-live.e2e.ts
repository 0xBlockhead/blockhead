import { stringify } from 'devalue'
import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

import { entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

import {
	assertMainSettled,
	expectMainVisible,
	installChainlistRpcsJsonStub,
	installPersistenceProbe,
	setupPageRuntimeDiagnostics,
} from '../_e2eBrowserHelpers.ts'

const fieldCollectionId = (
	entityType: string,
	facetPath: readonly string[],
	fieldName: string
) => stringify([
	'client.fields',
	entityType,
	facetPath,
	fieldName,
])

const pageErrors = (issues: string[]) => (
	issues.filter((i) => i.startsWith('pageerror:'))
)

const readBlocksDiagnostics = (
	page: Page
) => page.evaluate(({ collectionId, fieldAddressKey }) => {
	const probe = window.__blockheadClientProbe
	if (probe == null)
		throw new Error('missing blockhead client probe')

	return {
		fieldRows: probe.collectionSizes().fields.Network[fieldAddressKey],
		loads: probe.events.collectionLoads.filter((event) => event.collectionId === collectionId),
	}
}, {
	collectionId: fieldCollectionId(EntityType.Network, ['Evm'], '$$blocks'),
	fieldAddressKey: entityFieldAddressKey(EntityType.Network, ['Evm'], '$$blocks'),
})

const readFieldLoads = (
	page: Page
) => page.evaluate(() => {
	const probe = window.__blockheadClientProbe
	if (probe == null)
		throw new Error('missing blockhead client probe')

	return probe.events.collectionLoads
})

const assertOnlyRouteOwnedEvmFields = async (
	page: Page,
	routeOwnedFieldName: string
) => {
	const collectionIds = (await readFieldLoads(page)).map(({ collectionId }) => collectionId)
	expect(collectionIds).toContain(fieldCollectionId(EntityType.Network, ['Evm'], routeOwnedFieldName))
	expect(collectionIds.filter((collectionId) => (
		[
			...[
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
				'$$siblingShardNetworks',
				'$$childLayers',
				'$$settledRollups',
			].map((fieldName) => fieldCollectionId(EntityType.Network, ['Evm'], fieldName)),
			...[
				'$$faucetUrls',
				'$$blockExplorerUrls',
			].map((fieldName) => fieldCollectionId(EntityType.Network, [], fieldName)),
		].includes(collectionId)
	))).toEqual([])
}

const assertNoFieldSyncs = async (
	page: Page,
	forbiddenFieldSyncs: {
		entityType: string
		fieldName: string
	}[]
) => {
	const fieldLoads = await readFieldLoads(page)
	expect(fieldLoads.filter(({ collectionId }) => (
		forbiddenFieldSyncs.some((forbiddenFieldSync) => (
			collectionId === fieldCollectionId(
				forbiddenFieldSync.entityType,
				[],
				forbiddenFieldSync.fieldName
			)
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
	const diagnostics = setupPageRuntimeDiagnostics(page)
	const requestUrls: string[] = []
	page.on('request', (request) => {
		requestUrls.push(request.url())
	})
	await page.goto(pathname, { waitUntil: 'load' })
	await expectMainVisible(page, 120_000, diagnostics)
	if (options.settle !== false)
		await assertMainSettled(page, 120_000, diagnostics)

	return {
		issues: diagnostics.issues,
		requestUrls,
	}
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
				&& diagnostics.loads.some((load) => load.status === 'completed')
			) ?
				'ok'
			:
				JSON.stringify(diagnostics)
		}, {
			message: 'Network/Evm/$$blocks must materialize rows into the TanStack DB field collection',
			timeout: 60_000,
			intervals: [
				500,
				1_000,
				2_000,
			],
		}).toBe('ok')
		expect((await readBlocksDiagnostics(page)).fieldRows).toBeGreaterThan(0)
		const firstBlockLink = page.locator('#blocks a[href*="/block/"]').first()
		await expect(firstBlockLink).toBeAttached()
		await expect(firstBlockLink).toHaveAttribute('href', /\/block\/[0-9]+\b/)
		await assertOnlyRouteOwnedEvmFields(page, '$$blocks')
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
		await assertOnlyRouteOwnedEvmFields(page, '$$transactions')
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
