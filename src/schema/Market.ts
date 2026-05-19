/**
 * Tradable book or index: two market asset legs (`$base`, `$quote`) and a venue reference to merge or split providers.
 */
import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import MarketAsset from '$/schema/MarketAsset.ts'
import MarketVenue from '$/schema/MarketVenue.ts'
import { Source } from '$/sources/$Source.ts'


const id = type({
	$base: MarketAsset.id,
	$quote: MarketAsset.id,
	$marketVenue: MarketVenue.id,
})

export { id }

export default {
	entityType: EntityType.Market,

	label: 'Market',
	labelPlural: 'Markets',

	id,

	fields: [
		{
			name: '$$baseCoin',
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
				Source.Coingecko_OpenApi,
				Source.CoinMarketCap_Rest,
				Source.Coinpaprika_OpenApi,
				Source.Defillama_OpenApi,
				Source.TradingView_Rest,
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
				Source.Defillama_OpenApi,
				Source.Coinpaprika_OpenApi,
				Source.CoinMarketCap_Rest,
			],
		},
		{
			name: '$$quotes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.TradingView_Rest],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
