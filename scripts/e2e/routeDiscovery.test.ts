import assert from 'node:assert/strict'
import test from 'node:test'

import { swarmDocsLandingReference } from '../../src/sources/Swarm/Rest/constants.ts'
import {
	e2eRouteFixtureMetadataByNodeId,
	type E2eRouteFixtureMapping,
} from '../../tests/e2e/_generatedRouteFixtureMetadata.ts'
import {
	discoverPathnamesFromRoutes,
	pathnameFromRouteFixture,
	routeFixtureParamsFromPathname,
	routeProbeCaseParams,
	routeProbeCasesForMapping,
} from '../../tests/e2e/_routeDiscovery.ts'
import { e2eRouteProbeAtomValueById } from '../../tests/e2e/_routeParamFixtures.ts'


test('route probe atom values exactly cover every generated atom', () => {
	const metadataValues: readonly { mappings: readonly E2eRouteFixtureMapping[] }[] = Object.values(e2eRouteFixtureMetadataByNodeId)
	const atomValues: Record<string, string> = { ...e2eRouteProbeAtomValueById }
	assert.deepEqual(
		[...new Set(metadataValues.flatMap((metadata) => (
			metadata.mappings.flatMap((mapping) => (
				routeProbeCasesForMapping(mapping).flatMap(({ atoms }) => atoms)
			))
		)))].sort(),
		Object.keys(atomValues).sort()
	)
})

test('keeps generated fixture variant identities distinct within a mapping', () => {
	assert.deepEqual(
		routeProbeCasesForMapping({
			id: 'fixture',
			probeCaseId: 'path',
			probeAtomPrefixes: ['fixture'],
			probeCases: [
				[[0, '1', ['value']]],
				[[0, '2', ['value']]],
			],
		}).map(({ id }) => id),
		['path', 'variant-2']
	)
})

test('excludes unsupported Hyperliquid observations while retaining block-scoped Near account state', () => {
	const mappingIds: string[] = Object.values(e2eRouteFixtureMetadataByNodeId).flatMap(({ mappings }) => (
		mappings.map(({ id }) => id)
	))

	for (const mappingId of [
		'HyperliquidAccount_Timestamp.AccountTimestampMsSource',
		'HyperliquidAccount_Timestamp.AccountInfoTypeTimestampMsSource',
		'HyperliquidOrderbook_Timestamp.NetworkBookKeyTimestampMsSource',
		'HyperliquidPerpMarket_Timestamp.PerpMarketTimestampMsSource',
		'HyperliquidTransaction_Timestamp.TransactionTimestampMsSource',
		'HyperliquidValidator_Timestamp.ValidatorTimestampMsSource',
	])
		assert.equal(mappingIds.includes(mappingId), false)

	assert.equal(mappingIds.includes('NearAccount_Block.AccountBlock'), true)
	assert.equal(Object.keys(e2eRouteProbeAtomValueById).some((atom) => (
		[
			'HyperliquidAccount_Timestamp',
			'HyperliquidOrderbook_Timestamp',
			'HyperliquidPerpMarket_Timestamp',
			'HyperliquidTransaction_Timestamp',
			'HyperliquidValidator_Timestamp',
		].some((entityType) => atom.includes(`:${entityType}.`))
	)), false)
})

test('completes global discovery including IPFS and Swarm selector path variants', async () => {
	assert.deepEqual(
		(await discoverPathnamesFromRoutes()).filter((pathname) => (
			pathname.startsWith('/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG')
			|| pathname.startsWith(`/swarm/${swarmDocsLandingReference}`)
		)),
		[
			'/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
			'/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/path/readme',
			`/swarm/${swarmDocsLandingReference}`,
			`/swarm/${swarmDocsLandingReference}/path/readme`,
		]
	)
})

const metadataForMapping = (nodeId: keyof typeof e2eRouteFixtureMetadataByNodeId, mappingId: string) => {
	const metadata = e2eRouteFixtureMetadataByNodeId[nodeId]
	assert.ok(metadata, mappingId)
	const mapping = metadata.mappings.find(({ id }) => id === mappingId)
	assert.ok(mapping, mappingId)
	return { mapping, metadata }
}

const paramsForProbeCase = (probeCase: { atoms: readonly string[] }) => {
	const atomValues: Record<string, string> = { ...e2eRouteProbeAtomValueById }
	return Object.fromEntries(Object.entries(routeProbeCaseParams(probeCase)).map(([param, atom]) => {
		const value = atomValues[atom]
		assert.ok(value, atom)
		return [param, value]
	}))
}

test('round-trips representative selector shapes through public path matching', () => {
	const classes = [
		['nested composite ancestors', '/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]/event/[eventIndex]', 'PolkadotEvent.BlockIndexInBlock'],
		['opaque absolute URL segments', '/(agents)/agents/a2a/card/[agentCardUrl]/service/[protocolBinding]/[endpointUrl]', 'A2aAgentService.CardProtocolBindingEndpointUrl'],
		['rest path segments', '/(explore)/(ipfs)/[namespace]/[target]/path/[...contentPath]', 'IpfsResource.ResourceAddress'],
		['projection-owned route', '/(explore)/(networks)/network/[network]/(contracts)/contract/[address]', 'EvmContract.EvmNetworkAddress'],
		['canonicalizing ingress alias', '/(social)/(atproto)/atproto/actor/handle/[handle]', 'AtprotoActor.Handle'],
		['suppressed UTXO height href', '/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]', 'UtxoBlock.NetworkHeight'],
	] as const

	for (const [label, nodeId, mappingId] of classes) {
		const { mapping, metadata } = metadataForMapping(nodeId, mappingId)
		const probeCase = routeProbeCasesForMapping(mapping)[0]
		assert.ok(probeCase, label)
		const params = paramsForProbeCase(probeCase)
		const pathname = pathnameFromRouteFixture(metadata, params)

		assert.deepEqual(routeFixtureParamsFromPathname(metadata, pathname), params, label)
	}
})

test('keeps repeated public route mappings reconstructible without conflating selectors', () => {
	const sharedRouteMetadata = [
		e2eRouteFixtureMetadataByNodeId['/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]'],
		e2eRouteFixtureMetadataByNodeId['/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]'],
	]

	for (const metadata of sharedRouteMetadata) {
		assert.ok(metadata)
		assert.equal(new Set(metadata.mappings.map(({ id }) => id)).size, metadata.mappings.length)
		for (const mapping of metadata.mappings) {
			const probeCase = routeProbeCasesForMapping(mapping)[0]
			assert.ok(probeCase, mapping.id)
			const params = paramsForProbeCase(probeCase)

			assert.deepEqual(
				routeFixtureParamsFromPathname(metadata, pathnameFromRouteFixture(metadata, params)),
				params,
				mapping.id
			)
		}
	}
})

test('rejects path values after a matcher discriminator is weakened or changed', () => {
	const metadata = structuredClone(
		e2eRouteFixtureMetadataByNodeId['/(social)/(atproto)/atproto/actor/handle/[handle]']
	)
	metadata.routeId = metadata.routeId.replace('stringSegment', 'nonNegativeInteger')

	assert.throws(
		() => routeFixtureParamsFromPathname(metadata, '/atproto/actor/handle/journeyfixture.test'),
		/invalid route parameter handle/
	)
})

test('keeps Polkadot and Lightning route atoms on their canonical networks', () => {
	const atomValues: Record<string, string> = { ...e2eRouteProbeAtomValueById }
	const errors = () => [
		atomValues["/network/[network]/block/[blockNumber]:PolkadotBlock.NetworkBlockNumber.1.network"] === 'polkadot' ? undefined : 'Polkadot block network',
		atomValues["/network/[network]/block/[blockNumber]/[hash]:PolkadotBlock.NetworkBlockNumberHash.1.hash"] === '0x91b171bb158e2d3848fa23a9f1c25182cedb3f91e4e2d3d9df7f384c2a75c24' ? undefined : 'Polkadot block hash',
		atomValues["/network/[network]/block/[blockNumber]/[hash]/event/[eventIndex]:PolkadotEvent.BlockIndexInBlock.1.hash"] === '0x91b171bb158e2d3848fa23a9f1c25182cedb3f91e4e2d3d9df7f384c2a75c24' ? undefined : 'Polkadot event block hash',
		atomValues["/network/[network]/block/[blockNumber]/[hash]/extrinsic/[extrinsicIndex]:PolkadotExtrinsic.BlockIndexInBlock.1.hash"] === '0x91b171bb158e2d3848fa23a9f1c25182cedb3f91e4e2d3d9df7f384c2a75c24' ? undefined : 'Polkadot extrinsic block hash',
		atomValues["/network/[network]/invoices/[paymentHash]:BlockheadLightningInvoice.NetworkPaymentHash.1.network"] === 'lightning' ? undefined : 'Lightning invoice network',
		atomValues["/network/[network]/payments/[paymentHash]:BlockheadLightningPayment.NetworkPaymentHash.1.network"] === 'lightning' ? undefined : 'Lightning payment network',
	].filter(Boolean)

	assert.deepEqual(errors(), [])
	atomValues["/network/[network]/block/[blockNumber]:PolkadotBlock.NetworkBlockNumber.1.network"] = 'eip155:1'
	assert.deepEqual(errors(), ['Polkadot block network'])

	for (const [mappingId, expectedPathname] of [
		['PolkadotBlock.NetworkBlockNumber', '/network/polkadot/block/0'],
		['PolkadotBlock.NetworkBlockNumberHash', '/network/polkadot/block/0/0x91b171bb158e2d3848fa23a9f1c25182cedb3f91e4e2d3d9df7f384c2a75c24'],
		['PolkadotEvent.BlockIndexInBlock', '/network/polkadot/block/0/0x91b171bb158e2d3848fa23a9f1c25182cedb3f91e4e2d3d9df7f384c2a75c24/event/0'],
		['PolkadotExtrinsic.BlockIndexInBlock', '/network/polkadot/block/0/0x91b171bb158e2d3848fa23a9f1c25182cedb3f91e4e2d3d9df7f384c2a75c24/extrinsic/0'],
		['BlockheadLightningInvoice.NetworkPaymentHash', '/network/lightning/invoices/e2e-probe-paymentHash'],
		['BlockheadLightningPayment.NetworkPaymentHash', '/network/lightning/payments/e2e-probe-paymentHash'],
	] as const) {
		const metadata = Object.values(e2eRouteFixtureMetadataByNodeId).find((candidate) => (
			candidate.mappings.some((mapping) => mapping.id === mappingId)
		))
		assert.ok(metadata)
		const mapping: E2eRouteFixtureMapping | undefined = metadata.mappings.find((candidate) => candidate.id === mappingId)
		assert.ok(mapping)
			const probeCase = routeProbeCasesForMapping(mapping)[0]
			assert.ok(probeCase)
			const probeAtomValues: Record<string, string> = { ...e2eRouteProbeAtomValueById }
			assert.equal(
				pathnameFromRouteFixture(metadata, Object.fromEntries(Object.entries(routeProbeCaseParams(probeCase)).map(([param, atom]) => [
					param,
					probeAtomValues[atom],
			]))),
			expectedPathname
		)
	}
})
