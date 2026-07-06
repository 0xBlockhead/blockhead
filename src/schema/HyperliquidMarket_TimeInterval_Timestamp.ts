// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum HyperliquidMarket_TimeInterval_TimestampSelector {
	NetworkMarketKeyTimeIntervalTimestampMs = 'NetworkMarketKeyTimeIntervalTimestampMs',
}
export default {
	entityType: EntityType.HyperliquidMarket_TimeInterval_Timestamp,
	label: 'hyperliquid market time interval timestamp',
	labelPlural: 'hyperliquid market time interval observations',
	selectors: [
		{
			name: HyperliquidMarket_TimeInterval_TimestampSelector.NetworkMarketKeyTimeIntervalTimestampMs,
			fields: [
				'$network',
				'marketKey',
				'timeInterval',
				'timestampMs',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'marketKey',
			label: 'market key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timeInterval',
			label: 'time interval',
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
			name: '$perpMarket',
			label: 'perp market',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HyperliquidPerpMarket,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$spotPair',
			label: 'spot pair',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HyperliquidSpotPair,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'open',
			label: 'open',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'high',
			label: 'high',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'low',
			label: 'low',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'close',
			label: 'close',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'volume',
			label: 'volume',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tradeCount',
			label: 'trade count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
