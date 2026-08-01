// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AiModelProvider,
		cardinality: EntityFieldCardinality.One,
	},
	catalogKind: {
		label: 'catalog kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	providerEntryId: {
		label: 'provider entry ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	entryLabel: {
		label: 'entry label',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subjectKind: {
		label: 'subject kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subjectSelector: {
		label: 'subject selector',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
