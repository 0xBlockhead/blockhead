// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AiProviderCatalogEntry_TimestampSelector {
	EntryTimestampMsSource = 'EntryTimestampMsSource',
}
export const AiProviderCatalogEntry_Timestamp = entity({
	entityType: EntityType.AiProviderCatalogEntry_Timestamp,
	labels: {
		singular: 'AI provider catalog entry timestamp',
		plural: 'AI provider catalog entry observations',
	},
})({
	$entry: {
		label: 'entry',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AiProviderCatalogEntry,
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
	availabilityStatus: {
		label: 'availability status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	raw: {
		label: 'raw',
		type: EntityFieldType.Primitive,
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
