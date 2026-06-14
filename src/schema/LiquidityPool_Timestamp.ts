import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import LiquidityPool from '$/schema/LiquidityPool.ts'
import { Source } from '$/sources/Source.ts'

export enum LiquidityPool_TimestampSelector {
	LiquidityPoolTimestampMsFeedKey = 'liquidityPoolTimestampMsFeedKey',
}

export default {
	entityType: EntityType.LiquidityPool_Timestamp,

	label: 'Liquidity pool observation',
	labelPlural: 'Liquidity pool observations',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LiquidityPool,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'feedKey',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$parentLiquidityPool',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LiquidityPool,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: 'priceUsd',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: 'priceNative',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: 'liquidityUsd',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: 'volumeUsd24h',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: 'priceChangePercent24h',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: 'transactionBuys24h',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: 'transactionSells24h',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: 'marketCapUsd',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: 'fdvUsd',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Dexscreener_OpenApi,
			],
		},
		{
			name: 'transport',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
