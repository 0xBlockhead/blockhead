import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum Market_TimeInterval_TimestampSelector {
	MarketTimeIntervalTimestampMs = 'marketTimeIntervalTimestampMs',
}
export default {
	entityType: EntityType.Market_TimeInterval_Timestamp,
	label: 'market time interval timestamp',
	labelPlural: 'market time interval observations',
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
			label: 'market',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timeInterval',
			label: 'time interval',
			type: EntityFieldType.Primitive,
			primitiveType: type({"unit": "string", "value": "number"}),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$parentMarket',
			label: 'parent market',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Market,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'open',
			label: 'open',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'high',
			label: 'high',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'low',
			label: 'low',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'close',
			label: 'close',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'volume',
			label: 'volume',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'quoteVolume',
			label: 'quote volume',
			description: 'Quote-leg candle volume, scaled by 1e8 like quote prices.',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tradeCount',
			label: 'trade count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'vwap',
			label: 'vwap',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
