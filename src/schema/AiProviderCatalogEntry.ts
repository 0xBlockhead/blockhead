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
		label: 'provider',
		entityType: EntityType.AiModelProvider,
		cardinality: EntityFieldCardinality.One,
	},
	catalogKind: {
		label: 'catalog kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	providerEntryId: {
		label: 'provider entry ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	entryLabel: {
		label: 'entry label',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subjectKind: {
		label: 'subject kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subjectSelector: {
		label: 'subject selector',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
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
