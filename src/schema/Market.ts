// Generated from APP.ts. Do not edit by hand.

import { MarketKind } from '$/constants/Market.ts'
import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum MarketSelector {
	BaseQuoteMarketVenueKind = 'BaseQuoteMarketVenueKind',
}
export const Market = entity({
	entityType: EntityType.Market,
	labels: {
		singular: 'Market',
		plural: 'markets',
	},
})({
	$base: {
		type: EntityFieldType.EntityReference,
		entityType: EntityType.MarketAsset,
		cardinality: EntityFieldCardinality.One,
	},
	$quote: {
		type: EntityFieldType.EntityReference,
		entityType: EntityType.MarketAsset,
		cardinality: EntityFieldCardinality.One,
	},
	$marketVenue: {
		type: EntityFieldType.EntityReference,
		entityType: EntityType.MarketVenue,
		cardinality: EntityFieldCardinality.One,
	},
	marketKind: {
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(MarketKind)),
		cardinality: EntityFieldCardinality.One,
	},
	$baseCoin: {
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Coin,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Constants_Internal,
			Source.Coingecko_Rest,
		],
	},
	$$marketPrices: {
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.MarketPrice,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.Coingecko_Rest,
			Source.Coingecko_OpenApi,
			Source.CoinMarketCap_Rest,
			Source.Coinpaprika_OpenApi,
			Source.Defillama_OpenApi,
			Source.Blockscout_Rest,
			Source.Defillama_Rest,
		],
	},
	$$marketTimeIntervalTimestamps: {
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Market_TimeInterval_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Coingecko_Rest,
			Source.Coingecko_OpenApi,
			Source.Coinpaprika_OpenApi,
			Source.CoinMarketCap_Rest,
		],
	},
	$$derivativeTimestamps: {
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Market_Derivative_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Coingecko_OpenApi,
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
})
