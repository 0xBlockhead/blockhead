// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HyperliquidSpotPairSelector {
	NetworkPairIndex = 'NetworkPairIndex',
}
export default {
	entityType: EntityType.HyperliquidSpotPair,
	label: 'hyperliquid spot pair',
	labelPlural: 'hyperliquid spot pairs',
	selectors: [
		{
			name: HyperliquidSpotPairSelector.NetworkPairIndex,
			fields: [
				'$network',
				'pairIndex',
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
			name: 'pairIndex',
			label: 'pair index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$baseAsset',
			label: 'base asset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HyperliquidSpotAsset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$quoteAsset',
			label: 'quote asset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HyperliquidSpotAsset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidSpotPair_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
