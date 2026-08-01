// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HyperliquidSpotPair,
	labels: {
		singular: 'hyperliquid spot pair',
		plural: 'hyperliquid spot pairs',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	pairIndex: {
		label: 'pair index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$baseAsset: {
		label: 'base asset',
		entityType: EntityType.HyperliquidSpotAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$quoteAsset: {
		label: 'quote asset',
		entityType: EntityType.HyperliquidSpotAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.HyperliquidSpotPair_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkPairIndex: [
			'$network',
			'pairIndex',
		],
	},
})
