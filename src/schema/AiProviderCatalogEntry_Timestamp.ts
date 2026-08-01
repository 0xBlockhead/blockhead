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
		label: 'entry',
		entityType: EntityType.AiProviderCatalogEntry,
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
	availabilityStatus: {
		label: 'availability status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	raw: {
		label: 'raw',
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
