// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HyperliquidSpotAssetSelector {
	NetworkAssetId = 'NetworkAssetId',
}
export default {
	entityType: EntityType.HyperliquidSpotAsset,
	label: 'hyperliquid spot asset',
	labelPlural: 'hyperliquid spot assets',
	selectors: [
		{
			name: HyperliquidSpotAssetSelector.NetworkAssetId,
			fields: [
				'$network',
				'assetId',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'assetId',
				label: 'asset ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidSpotAsset_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$basePairs',
				label: 'base pairs',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidSpotPair,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$quotePairs',
				label: 'quote pairs',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidSpotPair,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
