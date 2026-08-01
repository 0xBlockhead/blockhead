// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Market_Timestamp,
	labels: {
		singular: 'market timestamp',
		plural: 'market observations',
	},
	description: 'A point-in-time market quote or metric observation.',
})({
	$market: {
		label: 'Market',
		entityType: EntityType.Market,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	feedKey: {
		label: 'Feed key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	price: {
		label: 'Price',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	transport: {
		label: 'Transport',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	providerAssetId: {
		label: 'Provider asset ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	caip19: {
		label: 'CAIP-19',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		MarketTimestampMsFeedKey: [
			'$market',
			'timestampMs',
			'feedKey',
		],
	},
})
