// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum Market_TimeInterval_TimestampSelector {
	MarketTimeIntervalTimestampMs = 'MarketTimeIntervalTimestampMs',
}
export default {
	entityType: EntityType.Market_TimeInterval_Timestamp,
	label: 'OHLC candle',
	labelPlural: 'OHLC candles',
	selectors: [
		{
			name: Market_TimeInterval_TimestampSelector.MarketTimeIntervalTimestampMs,
			fields: [
				'$market',
				'timeInterval',
				'timestampMs',
			],
		},
	],
	fields: [
		{
				name: '$market',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Market,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timeInterval',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'unit': type('string'), 'value': type('number') }),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$parentMarket',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Market,
				cardinality: EntityFieldCardinality.One,
				defaultSources: [
					Source.Constants_Internal,
					Source.Coingecko_Rest,
					Source.Coingecko_OpenApi,
					Source.Coinpaprika_OpenApi,
					Source.CoinMarketCap_Rest,
				],
		},
		{
				name: 'open',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Coingecko_Rest,
					Source.Coingecko_OpenApi,
					Source.Coinpaprika_OpenApi,
					Source.CoinMarketCap_Rest,
				],
		},
		{
				name: 'high',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Coingecko_Rest,
					Source.Coingecko_OpenApi,
					Source.Coinpaprika_OpenApi,
					Source.CoinMarketCap_Rest,
				],
		},
		{
				name: 'low',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Coingecko_Rest,
					Source.Coingecko_OpenApi,
					Source.Coinpaprika_OpenApi,
					Source.CoinMarketCap_Rest,
				],
		},
		{
				name: 'close',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Coingecko_Rest,
					Source.Coingecko_OpenApi,
					Source.Coinpaprika_OpenApi,
					Source.CoinMarketCap_Rest,
				],
		},
		{
				name: 'quoteVolume',
				label: 'Quote volume',
				description: 'Quote-leg candle volume, scaled by 1e8 like quote prices.',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Coinpaprika_OpenApi,
					Source.CoinMarketCap_Rest,
				],
		},
	],
} as const satisfies EntityDefinition
