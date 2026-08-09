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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	pairIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$baseAsset: {
		entityType: EntityType.HyperliquidSpotAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$quoteAsset: {
		entityType: EntityType.HyperliquidSpotAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
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
