// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const dexscreenerRestSources = [
	Source.Dexscreener_Rest,
] as const

export default entity({
	entityType: EntityType.LiquidityPool_Timestamp,
	labels: {
		singular: 'liquidity pool timestamp',
		plural: 'liquidity pool observations',
	},
})({
	$liquidityPool: {
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	feedKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$parentLiquidityPool: {
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.One,
		defaultSources: dexscreenerRestSources,
	},
	baseTokenSymbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: dexscreenerRestSources,
	},
	quoteTokenSymbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: dexscreenerRestSources,
	},
	baseTokenDecimals: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	quoteTokenDecimals: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pairCreatedAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: dexscreenerRestSources,
	},
	dexscreenerLabels: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: dexscreenerRestSources,
	},
	dexId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: dexscreenerRestSources,
	},
	dexscreenerPairUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: dexscreenerRestSources,
	},
	priceUsd: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: dexscreenerRestSources,
	},
	priceNative: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: dexscreenerRestSources,
	},
	liquidityUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: dexscreenerRestSources,
	},
	volumeUsd24h: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: dexscreenerRestSources,
	},
	priceChangePercent24h: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: dexscreenerRestSources,
	},
	transactionBuys24h: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: dexscreenerRestSources,
	},
	transactionSells24h: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: dexscreenerRestSources,
	},
	marketCapUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: dexscreenerRestSources,
	},
	fdvUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: dexscreenerRestSources,
	},
	transport: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: dexscreenerRestSources,
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
