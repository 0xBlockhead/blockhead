import { type } from 'arktype'
import {
	MarketTimeIntervalUnit,
} from '$/constants/Market.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Market from '$/schema/Market.ts'
import {
	Source,
	marketOhlcCandleSources,
} from '$/sources/Source.ts'

export enum Market_TimeInterval_TimestampSelector {
	MarketTimeIntervalTimestampMs = 'marketTimeIntervalTimestampMs',
}

export default {
	entityType: EntityType.Market_TimeInterval_Timestamp,

	label: 'OHLC interval',
	labelPlural: 'OHLC intervals',

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
			primitiveType: type({
				unit: type.valueOf(MarketTimeIntervalUnit),
				value: 'number',
			}),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
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
				...marketOhlcCandleSources,
			],
		},
		{
			name: 'open',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [...marketOhlcCandleSources],
		},
		{
			name: 'high',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [...marketOhlcCandleSources],
		},
		{
			name: 'low',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [...marketOhlcCandleSources],
		},
		{
			name: 'close',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [...marketOhlcCandleSources],
		},
		{
			name: 'volume',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			// Quote-leg candle volume, scaled by 1e8 like quote prices.
			name: 'quoteVolume',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Coinpaprika_OpenApi,
				Source.CoinMarketCap_Rest,
			],
		},
		{
			name: 'tradeCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'vwap',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
