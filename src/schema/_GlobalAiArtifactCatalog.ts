// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		label: 'Label',
		description: 'A human-readable name for the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	catalogKind: {
		label: 'catalog kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$artifacts: {
		label: 'artifacts',
		entityType: EntityType.AiArtifact,
		cardinality: EntityFieldCardinality.Many,
	},
	$$documents: {
		label: 'documents',
		entityType: EntityType.AiDocument,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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
