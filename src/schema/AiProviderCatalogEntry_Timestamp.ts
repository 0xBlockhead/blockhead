// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AiProviderCatalogEntry_Timestamp,
	labels: {
		singular: 'AI provider catalog entry timestamp',
		plural: 'AI provider catalog entry observations',
	},
})({
	$entry: {
		entityType: EntityType.AiProviderCatalogEntry,
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
	availabilityStatus: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	raw: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		EntryTimestampMsSource: [
			'$entry',
			'timestampMs',
			'source',
		],
	},
})
