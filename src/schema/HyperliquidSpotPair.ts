// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HyperliquidSpotPairSelector {
	NetworkPairIndex = 'NetworkPairIndex',
}
export const HyperliquidSpotPair = entity({
	entityType: EntityType.HyperliquidSpotPair,
	labels: {
		singular: 'hyperliquid spot pair',
		plural: 'hyperliquid spot pairs',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	pairIndex: {
		label: 'pair index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$baseAsset: {
		label: 'base asset',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HyperliquidSpotAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$quoteAsset: {
		label: 'quote asset',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HyperliquidSpotAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
