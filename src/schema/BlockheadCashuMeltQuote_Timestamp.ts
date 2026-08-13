// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadCashuMeltQuote_Timestamp,
	labels: {
		singular: 'blockhead Cashu melt quote timestamp',
		plural: 'blockhead Cashu melt quote observations',
	},
})({
	$meltQuote: {
		entityType: EntityType.BlockheadCashuMeltQuote,
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
	state: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	expiryMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subscriptionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		MeltQuoteTimestampMsSource: [
			'$meltQuote',
			'timestampMs',
			'source',
		],
	},
})
