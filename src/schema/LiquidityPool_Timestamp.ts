// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum LiquidityPool_TimestampSelector {
	LiquidityPoolTimestampMsFeedKey = 'LiquidityPoolTimestampMsFeedKey',
}
export const LiquidityPool_Timestamp = entity({
	entityType: EntityType.LiquidityPool_Timestamp,
	labels: {
		singular: 'liquidity pool timestamp',
		plural: 'liquidity pool observations',
	},
})({
	$liquidityPool: {
		label: 'Liquidity pool',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	feedKey: {
		label: 'Feed key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$parentLiquidityPool: {
		label: 'Parent liquidity pool',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Dexscreener_OpenApi,
		],
	},
	baseTokenSymbol: {
		label: 'Base token symbol',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_OpenApi,
		],
	},
	quoteTokenSymbol: {
		label: 'Quote token symbol',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_OpenApi,
		],
	},
	baseTokenDecimals: {
		label: 'Base token decimals',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	quoteTokenDecimals: {
		label: 'Quote token decimals',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pairCreatedAtMs: {
		label: 'Pair created',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_OpenApi,
		],
	},
	dexscreenerLabels: {
		label: 'Dexscreener labels',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Dexscreener_OpenApi,
		],
	},
	dexId: {
		label: 'DEX',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_OpenApi,
		],
	},
	dexscreenerPairUrl: {
		label: 'Dexscreener',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_OpenApi,
		],
	},
	priceUsd: {
		label: 'Price USD',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_OpenApi,
		],
	},
	priceNative: {
		label: 'Price native',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_OpenApi,
		],
	},
	liquidityUsd: {
		label: 'Liquidity USD',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_OpenApi,
		],
	},
	volumeUsd24h: {
		label: 'Volume USD 24h',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_OpenApi,
		],
	},
	priceChangePercent24h: {
		label: 'Price change 24h',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_OpenApi,
		],
	},
	transactionBuys24h: {
		label: 'Buys 24h',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_OpenApi,
		],
	},
	transactionSells24h: {
		label: 'Sells 24h',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_OpenApi,
		],
	},
	marketCapUsd: {
		label: 'Market cap USD',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_OpenApi,
		],
	},
	fdvUsd: {
		label: 'FDV USD',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_OpenApi,
		],
	},
	transport: {
		label: 'Transport',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_OpenApi,
		],
	},
})({
	selectors: {
		LiquidityPoolTimestampMsFeedKey: [
			'$liquidityPool',
			'timestampMs',
			'feedKey',
		],
	},
})
