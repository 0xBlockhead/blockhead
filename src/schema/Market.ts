// Generated from APP.ts. Do not edit by hand.

import { MarketKind } from '$/constants/Market.ts'
import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { marketAsset } from '$/schema/MarketAsset.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum MarketSelector {
	BaseQuoteMarketVenueKind = 'BaseQuoteMarketVenueKind',
}
export default {
	entityType: EntityType.Market,
	label: 'Market',
	labelPlural: 'markets',
	selectors: [
		{
			name: MarketSelector.BaseQuoteMarketVenueKind,
			fields: [
				'$base',
				'$quote',
				'$marketVenue',
				'marketKind',
			],
		},
	],
	fields: [
		{
			name: '$base',
			type: EntityFieldType.Primitive,
			primitiveType: (marketAsset),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$quote',
			type: EntityFieldType.Primitive,
			primitiveType: (marketAsset),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$marketVenue',
			type: EntityFieldType.Primitive,
			primitiveType: type({ 'marketVenueId': type('string') }),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'marketKind',
			type: EntityFieldType.Primitive,
			primitiveType: type.enumerated(...Object.values(MarketKind)),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$baseCoin',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Coin,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
				Source.Coingecko_Rest,
			],
		},
		{
			name: '$$marketPrices',
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
		{
			name: '$$marketTimeIntervalTimestamps',
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
		{
			name: '$$derivativeTimestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market_Derivative_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Coingecko_OpenApi,
			],
		},
	],
} as const satisfies EntityDefinition
