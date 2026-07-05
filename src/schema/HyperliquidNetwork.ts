// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HyperliquidNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.HyperliquidNetwork,
	label: 'hyperliquid network',
	labelPlural: 'hyperliquid networks',
	selectors: [
		{
			name: HyperliquidNetworkSelector.Network,
			fields: [
				'$network',
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
				name: 'rpcEndpoints',
				label: 'RPC endpoints',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'restEndpoints',
				label: 'REST endpoints',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'url': type('string'), 'transportType': type('string'), 'providerName': type('string') }),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$blocks',
				label: 'blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidBlock,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$transactions',
				label: 'transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidTransaction,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$validators',
				label: 'validators',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidValidator,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$spotAssets',
				label: 'spot assets',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidSpotAsset,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$spotPairs',
				label: 'spot pairs',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidSpotPair,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$perpMarkets',
				label: 'perp markets',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidPerpMarket,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$vaults',
				label: 'vaults',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.HyperliquidVault,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
