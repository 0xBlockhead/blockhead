// Generated from APP.ts.

import { MarketKind } from '$/constants/Market.ts'
import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Market,
	labels: {
		singular: 'Market',
		plural: 'markets',
	},
})({
	$base: {
		entityType: EntityType.MarketAsset,
		cardinality: EntityFieldCardinality.One,
	},
	$quote: {
		entityType: EntityType.MarketAsset,
		cardinality: EntityFieldCardinality.One,
	},
	$marketVenue: {
		entityType: EntityType.MarketVenue,
		cardinality: EntityFieldCardinality.One,
	},
	marketKind: {
		primitiveType: type.enumerated(...Object.values(MarketKind)),
		cardinality: EntityFieldCardinality.One,
	},
	$baseCoin: {
		entityType: EntityType.Coin,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.Coingecko_Rest,
		],
	},
	$$marketPrices: {
		entityType: EntityType.MarketPrice,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.Coingecko_Rest,
			Source.TradingView_Rest,
		],
	},
	$$marketTimeIntervalTimestamps: {
		entityType: EntityType.Market_TimeInterval_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Coingecko_Rest,
			Source.Coinpaprika_Rest,
			Source.CoinMarketCap_Rest,
			Source.Defillama_Rest,
		],
	},
	$$derivativeTimestamps: {
		entityType: EntityType.Market_Derivative_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Coingecko_Rest,
		],
	},
})({
	selectors: {
		BaseQuoteMarketVenueKind: [
			'$base',
			'$quote',
			'$marketVenue',
			'marketKind',
		],
	},

	facets: {
		Spot: facet({
			path: [
				'marketKind',
			],
			is: 'Spot',
		})({}),
		Derivative: facet({
			path: [
				'marketKind',
			],
			isOneOf: [
				'Perpetual',
				'Futures',
			],
		})({}),
	},
})
