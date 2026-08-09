// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HyperliquidPerpMarket_Timestamp,
	labels: {
		singular: 'hyperliquid perp market timestamp',
		plural: 'hyperliquid perp market observations',
	},
})({
	$perpMarket: {
		entityType: EntityType.HyperliquidPerpMarket,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	maxLeverage: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
	onlyIsolated: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Hyperliquid,
		],
	},
})({
	selectors: {
		PerpMarketTimestampMsSource: [
			'$perpMarket',
			'timestampMs',
			'source',
		],
	},
})
