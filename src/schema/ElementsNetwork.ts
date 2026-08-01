// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ElementsNetwork,
	labels: {
		singular: 'Elements network',
		plural: 'Elements networks',
	},
	description: 'Elements/Liquid-specific view over a canonical Network row, including federation metadata, settlement network, native asset, and registry assets.',
})({
	$network: {
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$settlementNetwork: {
		label: 'Settlement network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	federationName: {
		label: 'Federation',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	blockTimeSeconds: {
		label: 'Block time seconds',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$nativeAsset: {
		label: 'Native asset',
		entityType: EntityType.ElementsAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Esplora_Rest,
		],
	},
	confidentialTransactionsDefault: {
		label: 'Confidential transactions by default',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	$$assets: {
		label: 'Assets',
		entityType: EntityType.ElementsAsset,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Esplora_Rest,
		],
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
