// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HyperliquidPerpMarket_Timestamp,
	labels: {
		singular: 'hyperliquid perp market timestamp',
		plural: 'hyperliquid perp market observations',
	},
})({
	$perpMarket: {
		label: 'perp market',
		entityType: EntityType.HyperliquidPerpMarket,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	maxLeverage: {
		label: 'max leverage',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	onlyIsolated: {
		label: 'only isolated',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
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
