// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum _GlobalAiModelCatalogSelector {
	CatalogId = 'CatalogId',
}
export const _GlobalAiModelCatalog = entity({
	entityType: EntityType._GlobalAiModelCatalog,
	label: 'global AI model catalog',
	labelPlural: 'global AI model catalogs',
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
	$$providers: {
		label: 'providers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiModelProvider,
		cardinality: EntityFieldCardinality.Many,
	},
	$$catalogEntries: {
		label: 'catalog entries',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiProviderCatalogEntry,
		cardinality: EntityFieldCardinality.Many,
	},
	$$models: {
		label: 'models',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiModel,
		cardinality: EntityFieldCardinality.Many,
	},
	$$datasets: {
		label: 'datasets',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiDataset,
		cardinality: EntityFieldCardinality.Many,
	},
	$$benchmarks: {
		label: 'benchmarks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiBenchmark,
		cardinality: EntityFieldCardinality.Many,
	},
	$$evaluations: {
		label: 'evaluations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.AiEvaluation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
