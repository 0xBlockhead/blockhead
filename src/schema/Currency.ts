import { type } from 'arktype'
import { Iso4217 } from '$/constants/Currency.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum CurrencySelector {
	Iso4217 = 'iso4217',
}


export default {
	entityType: EntityType.Currency,

	label: 'Currency',
	labelPlural: 'Currencies',

	selectors: [
		{
			name: CurrencySelector.Iso4217,
			fields: [
				'iso4217',
			],
		},
	],

	fields: [
		{
			name: 'iso4217',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(Iso4217),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [Source.Constants_Internal],
		},
		{
			name: 'symbol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Constants_Internal],
		},
		{
			name: 'minorUnitExponent',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [Source.Constants_Internal],
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Currency_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [Source.Constants_Internal],
		},
		{
			name: '$$marketsWithCurrencyAsBase',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market,
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
			name: '$$marketsWithCurrencyAsQuote',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Market,
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
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
