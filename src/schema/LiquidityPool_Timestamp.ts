// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum LiquidityPool_TimestampSelector {
	LiquidityPoolTimestampMsFeedKey = 'LiquidityPoolTimestampMsFeedKey',
}
export default {
	entityType: EntityType.LiquidityPool_Timestamp,
	label: 'liquidity pool timestamp',
	labelPlural: 'liquidity pool observations',
	selectors: [
		{
			name: LiquidityPool_TimestampSelector.LiquidityPoolTimestampMsFeedKey,
			fields: [
				'$liquidityPool',
				'timestampMs',
				'feedKey',
			],
		},
	],
	fields: [
		{
				name: '$liquidityPool',
				label: 'Liquidity pool',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.LiquidityPool,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'feedKey',
				label: 'Feed key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$parentLiquidityPool',
				label: 'Parent liquidity pool',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.LiquidityPool,
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Dexscreener_OpenApi,
				],
		},
		{
				name: 'baseTokenSymbol',
				label: 'Base token symbol',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Dexscreener_OpenApi,
				],
		},
		{
				name: 'quoteTokenSymbol',
				label: 'Quote token symbol',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Dexscreener_OpenApi,
				],
		},
		{
				name: 'baseTokenDecimals',
				label: 'Base token decimals',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'quoteTokenDecimals',
				label: 'Quote token decimals',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'pairCreatedAtMs',
				label: 'Pair created',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Dexscreener_OpenApi,
				],
		},
		{
				name: 'dexscreenerLabels',
				label: 'Dexscreener labels',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Dexscreener_OpenApi,
				],
		},
		{
				name: 'dexId',
				label: 'DEX',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Dexscreener_OpenApi,
				],
		},
		{
				name: 'dexscreenerPairUrl',
				label: 'Dexscreener',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Dexscreener_OpenApi,
				],
		},
		{
				name: 'priceUsd',
				label: 'Price USD',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Dexscreener_OpenApi,
				],
		},
		{
				name: 'priceNative',
				label: 'Price native',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Dexscreener_OpenApi,
				],
		},
		{
				name: 'liquidityUsd',
				label: 'Liquidity USD',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Dexscreener_OpenApi,
				],
		},
		{
				name: 'volumeUsd24h',
				label: 'Volume USD 24h',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Dexscreener_OpenApi,
				],
		},
		{
				name: 'priceChangePercent24h',
				label: 'Price change 24h',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Dexscreener_OpenApi,
				],
		},
		{
				name: 'transactionBuys24h',
				label: 'Buys 24h',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Dexscreener_OpenApi,
				],
		},
		{
				name: 'transactionSells24h',
				label: 'Sells 24h',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Dexscreener_OpenApi,
				],
		},
		{
				name: 'marketCapUsd',
				label: 'Market cap USD',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Dexscreener_OpenApi,
				],
		},
		{
				name: 'fdvUsd',
				label: 'FDV USD',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Dexscreener_OpenApi,
				],
		},
		{
				name: 'transport',
				label: 'Transport',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Dexscreener_OpenApi,
				],
		},
	],
} as const satisfies EntityDefinition
