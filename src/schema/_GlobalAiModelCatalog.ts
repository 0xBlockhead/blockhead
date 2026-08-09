// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType._GlobalAiModelCatalog,
	labels: {
		singular: 'global AI model catalog',
		plural: 'global AI model catalogs',
	},
})({
	catalogId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	catalogKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$providers: {
		entityType: EntityType.AiModelProvider,
		cardinality: EntityFieldCardinality.Many,
	},
	$$catalogEntries: {
		entityType: EntityType.AiProviderCatalogEntry,
		cardinality: EntityFieldCardinality.Many,
	},
	$$models: {
		entityType: EntityType.AiModel,
		cardinality: EntityFieldCardinality.Many,
	},
	$$datasets: {
		entityType: EntityType.AiDataset,
		cardinality: EntityFieldCardinality.Many,
	},
	$$benchmarks: {
		entityType: EntityType.AiBenchmark,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType._GlobalAiModelCatalog_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		CatalogId: [
			'catalogId',
		],
	},
})
