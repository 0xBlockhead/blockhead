// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	marketKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timeInterval: {
		primitiveType: type({
			unit: type('string'),
			value: type('number'),
		}),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$perpMarket: {
		entityType: EntityType.HyperliquidPerpMarket,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$spotPair: {
		entityType: EntityType.HyperliquidSpotPair,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	open: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	high: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	low: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	close: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	volume: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tradeCount: {
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
