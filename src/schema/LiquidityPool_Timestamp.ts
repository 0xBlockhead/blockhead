// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

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
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	baseTokenSymbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	quoteTokenSymbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
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
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	dexscreenerLabels: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	dexId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	dexscreenerPairUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	priceUsd: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	priceNative: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	liquidityUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	volumeUsd24h: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	priceChangePercent24h: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	transactionBuys24h: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	transactionSells24h: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	marketCapUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	fdvUsd: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	transport: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
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
