// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const coingeckoRestCoinpaprikaRestCoinMarketCapRestSources = [
	Source.Coingecko_Rest,
	Source.Coinpaprika_Rest,
	Source.CoinMarketCap_Rest,
] as const

export default entity({
	entityType: EntityType.Market_TimeInterval_Timestamp,
	labels: {
		singular: 'OHLC candle',
		plural: 'OHLC candles',
	},
})({
	$market: {
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.One,
	},
	timeInterval: {
		primitiveType: type({
			unit: type('string'),
			value: type('number'),
		}),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$parentMarket: {
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Constants_Internal,
			Source.Coingecko_Rest,
			Source.Coinpaprika_Rest,
			Source.CoinMarketCap_Rest,
		],
	},
	open: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: coingeckoRestCoinpaprikaRestCoinMarketCapRestSources,
	},
	high: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: coingeckoRestCoinpaprikaRestCoinMarketCapRestSources,
	},
	low: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: coingeckoRestCoinpaprikaRestCoinMarketCapRestSources,
	},
	close: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: coingeckoRestCoinpaprikaRestCoinMarketCapRestSources,
	},
	quoteVolume: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Coinpaprika_Rest,
			Source.CoinMarketCap_Rest,
		],
	},
})({
	selectors: {
		MarketTimeIntervalTimestampMs: [
			'$market',
			'timeInterval',
			'timestampMs',
		],
	},
})
