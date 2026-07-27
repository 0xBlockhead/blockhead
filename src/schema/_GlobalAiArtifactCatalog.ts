// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType._GlobalAiArtifactCatalog,
	labels: {
		singular: 'global AI artifact catalog',
		plural: 'global AI artifact catalogs',
	},
})({
	catalogId: {
		label: 'catalog ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	catalogKind: {
		label: 'catalog kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$artifacts: {
		label: 'artifacts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiArtifact,
		cardinality: EntityFieldCardinality.Many,
	},
	$$documents: {
		label: 'documents',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiDocument,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType._GlobalAiArtifactCatalog_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		CatalogId: [
			'catalogId',
		],
	},
})
