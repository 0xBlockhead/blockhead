// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HyperliquidMarket_TimeInterval_Timestamp,
	labels: {
		singular: 'hyperliquid market time interval timestamp',
		plural: 'hyperliquid market time interval observations',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	marketKey: {
		label: 'market key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timeInterval: {
		label: 'time interval',
		type: EntityFieldType.Primitive,
		primitiveType: type({
			unit: type('string'),
			value: type('number'),
		}),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$perpMarket: {
		label: 'perp market',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HyperliquidPerpMarket,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$spotPair: {
		label: 'spot pair',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HyperliquidSpotPair,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	open: {
		label: 'open',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	high: {
		label: 'high',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	low: {
		label: 'low',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	close: {
		label: 'close',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	volume: {
		label: 'volume',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tradeCount: {
		label: 'trade count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkMarketKeyTimeIntervalTimestampMs: [
			'$network',
			'marketKey',
			'timeInterval',
			'timestampMs',
		],
	},
})
