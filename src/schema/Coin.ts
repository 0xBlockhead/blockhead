import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { CoinId } from '$/constants/Coin.ts'
export enum CoinSelector {
	CoinId = 'coinId',
}
export default {
	entityType: EntityType.Coin,
	label: 'coin',
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
			label: 'coin ID',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(CoinId),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'symbol',
			label: 'Symbol',
			description: 'The short ticker or symbol used for display.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'decimals',
			label: 'Decimals',
			description: 'The number of decimal places used to display the amount.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$logo',
			label: 'logo',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Coin_Timestamp,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$coinInstances',
			label: 'coin instances',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$marketsWithCoinAsBase',
			label: 'markets with coin as base',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$marketsWithCoinAsQuote',
			label: 'markets with coin as quote',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$bridgeCapabilities',
			label: 'bridge capabilities',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CoinBridgeCapability,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$assetSupplyTimestamps',
			label: 'asset supply timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AssetSupply_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
