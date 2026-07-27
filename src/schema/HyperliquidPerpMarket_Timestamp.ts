// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HyperliquidPerpMarket,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	maxLeverage: {
		label: 'max leverage',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	onlyIsolated: {
		label: 'only isolated',
		type: EntityFieldType.Primitive,
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
