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
		label: 'Liquidity pool',
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	feedKey: {
		label: 'Feed key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$parentLiquidityPool: {
		label: 'Parent liquidity pool',
		entityType: EntityType.LiquidityPool,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	baseTokenSymbol: {
		label: 'Base token symbol',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	quoteTokenSymbol: {
		label: 'Quote token symbol',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	baseTokenDecimals: {
		label: 'Base token decimals',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	quoteTokenDecimals: {
		label: 'Quote token decimals',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	pairCreatedAtMs: {
		label: 'Pair created',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	dexscreenerLabels: {
		label: 'Dexscreener labels',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	dexId: {
		label: 'DEX',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	dexscreenerPairUrl: {
		label: 'Dexscreener',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	priceUsd: {
		label: 'Price USD',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	priceNative: {
		label: 'Price native',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	liquidityUsd: {
		label: 'Liquidity USD',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	volumeUsd24h: {
		label: 'Volume USD 24h',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	priceChangePercent24h: {
		label: 'Price change 24h',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	transactionBuys24h: {
		label: 'Buys 24h',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	transactionSells24h: {
		label: 'Sells 24h',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	marketCapUsd: {
		label: 'Market cap USD',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	fdvUsd: {
		label: 'FDV USD',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Dexscreener_Rest,
		],
	},
	transport: {
		label: 'Transport',
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
