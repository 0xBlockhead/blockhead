// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AiProviderCatalogEntry,
	labels: {
		singular: 'AI provider catalog entry',
		plural: 'AI provider catalog entries',
	},
})({
	$provider: {
		entityType: EntityType.AiModelProvider,
		cardinality: EntityFieldCardinality.One,
	},
	catalogKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	providerEntryId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	entryLabel: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subjectKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subjectSelector: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.AiProviderCatalogEntry_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ProviderCatalogKindProviderEntryId: [
			'$provider',
			'catalogKind',
			'providerEntryId',
		],
	},
})
