import { type } from 'arktype'
import { CoinId } from '$/constants/Coin.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'


export default {
	entityType: EntityType.Coin,

	label: 'Coin',
	labelPlural: 'Coins',

	id: type({
		coinId: type.valueOf(CoinId),
	}),

	fields: [
		{
			name: 'symbol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'decimals',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$logo',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$coinInstances',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CoinInstance,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Coingecko_Rest],
		},
		{
			name: '$$marketsWithCoinAsBase',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.Coingecko_Rest,
				Source.CoinMarketCap_Rest,
				Source.Coinpaprika_OpenApi,
				Source.Defillama_Rest,
				Source.TradingView_Rest,
			],
		},
		{
			name: '$$marketsWithCoinAsQuote',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.Coingecko_Rest,
				Source.CoinMarketCap_Rest,
				Source.Coinpaprika_OpenApi,
				Source.Defillama_Rest,
				Source.TradingView_Rest,
			],
		},
		{
			name: '$$marketPrice',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MarketPrice,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
				Source.Coingecko_Rest,
				Source.CoinMarketCap_Rest,
				Source.Coinpaprika_OpenApi,
				Source.Defillama_Rest,
				Source.TradingView_Rest,
			],
		},
		{
			name: '$$marketPriceRanges',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MarketPriceRange,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Coingecko_Rest],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
