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
	$$providers: {
		label: 'providers',
		entityType: EntityType.AiModelProvider,
		cardinality: EntityFieldCardinality.Many,
	},
	$$catalogEntries: {
		label: 'catalog entries',
		entityType: EntityType.AiProviderCatalogEntry,
		cardinality: EntityFieldCardinality.Many,
	},
	$$models: {
		label: 'models',
		entityType: EntityType.AiModel,
		cardinality: EntityFieldCardinality.Many,
	},
	$$datasets: {
		label: 'datasets',
		entityType: EntityType.AiDataset,
		cardinality: EntityFieldCardinality.Many,
	},
	$$benchmarks: {
		label: 'benchmarks',
		entityType: EntityType.AiBenchmark,
		cardinality: EntityFieldCardinality.Many,
	},
	$$evaluations: {
		label: 'evaluations',
		entityType: EntityType.AiEvaluation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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
