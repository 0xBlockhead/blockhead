// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HyperliquidSpotAssetSelector {
	NetworkAssetId = 'NetworkAssetId',
}
export const HyperliquidSpotAsset = entity({
	entityType: EntityType.HyperliquidSpotAsset,
	label: 'hyperliquid spot asset',
	labelPlural: 'hyperliquid spot assets',
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	assetId: {
		label: 'asset ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HyperliquidSpotAsset_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$basePairs: {
		label: 'base pairs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HyperliquidSpotPair,
		cardinality: EntityFieldCardinality.Many,
	},
	$$quotePairs: {
		label: 'quote pairs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HyperliquidSpotPair,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkAssetId: [
			'$network',
			'assetId',
		],
	},
})
