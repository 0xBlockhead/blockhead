// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum _GlobalAiModelCatalogSelector {
	CatalogId = 'CatalogId',
}
export default {
	entityType: EntityType._GlobalAiModelCatalog,
	label: 'global AI model catalog',
	labelPlural: 'global AI model catalogs',
	selectors: [
		{
			name: _GlobalAiModelCatalogSelector.CatalogId,
			fields: [
				'catalogId',
			],
		},
	],
	fields: [
		{
				name: 'catalogId',
				label: 'catalog ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'label',
				label: 'Label',
				description: 'A human-readable name for the subject.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'catalogKind',
				label: 'catalog kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$providers',
				label: 'providers',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AiModelProvider,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$catalogEntries',
				label: 'catalog entries',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AiProviderCatalogEntry,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$models',
				label: 'models',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AiModel,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$datasets',
				label: 'datasets',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AiDataset,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$benchmarks',
				label: 'benchmarks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AiBenchmark,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$evaluations',
				label: 'evaluations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AiEvaluation_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType._GlobalAiModelCatalog_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
