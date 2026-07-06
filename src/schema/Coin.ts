// Generated from APP.ts. Do not edit by hand.

import { CoinId } from '$/constants/Coin.ts'
import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CoinSelector {
	CoinId = 'CoinId',
}
export default {
	entityType: EntityType.Coin,
	label: 'Coin',
	labelPlural: 'coins',
	description: 'A market-facing coin or crypto asset identity used across price, market, and network contexts.',
	selectors: [
		{
			name: CoinSelector.CoinId,
			fields: [
				'coinId',
			],
		},
	],
	fields: [
		{
			name: 'coinId',
			label: 'Coin ID',
			type: EntityFieldType.Primitive,
			primitiveType: type.enumerated(...Object.values(CoinId)),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'symbol',
			label: 'Symbol',
			description: 'The short ticker or symbol used for display.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'decimals',
			label: 'Decimals',
			description: 'The number of decimal places used to display the amount.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$logo',
			label: 'Logo',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'Timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Coin_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$coinInstances',
			label: 'Coin instances',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$marketsWithCoinAsBase',
			label: 'Markets with coin as base',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$marketsWithCoinAsQuote',
			label: 'Markets with coin as quote',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$bridgeCapabilities',
			label: 'Bridge capabilities',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CoinBridgeCapability,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$assetSupplyTimestamps',
			label: 'Asset supply timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AssetSupply_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
