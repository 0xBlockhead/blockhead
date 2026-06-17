/**
 * Tradable book or index: two market asset legs (`$base`, `$quote`) and a venue reference to merge or split providers.
 */
import { type } from 'arktype'
import { MarketKind } from '$/constants/Market.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { marketAsset } from '$/schema/MarketAsset.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import { Source } from '$/sources/Source.ts'

export enum MarketSelector {
	BaseQuoteMarketVenueKind = 'baseQuoteMarketVenueKind',
}

export default {
	entityType: EntityType.Market,

	label: 'Market',
	labelPlural: 'Markets',

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
			primitiveType: marketAsset,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$quote',
			type: EntityFieldType.Primitive,
			primitiveType: marketAsset,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$marketVenue',
			type: EntityFieldType.Primitive,
			primitiveType: type({
				marketVenueId: type.valueOf(MarketVenueId),
			}),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'marketKind',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(MarketKind),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$baseCoin',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Coin,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Constants_Internal, Source.Coingecko_Rest],
		},
		{
			name: '$$marketPrices',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MarketPrice,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.Coingecko_Rest,
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
		{
			name: '$$oracleFeeds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.OracleFeed,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.Voltaire_JsonRpc,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
