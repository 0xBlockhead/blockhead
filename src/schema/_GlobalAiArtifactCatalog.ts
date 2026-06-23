import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum _GlobalAiArtifactCatalogSelector {
	CatalogId = 'catalogId',
}
export default {
	entityType: EntityType._GlobalAiArtifactCatalog,
	label: 'global AI artifact catalog',
	labelPlural: 'global AI artifact catalogs',
	selectors: [
		{
			name: _GlobalAiArtifactCatalogSelector.CatalogId,
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
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'label',
			label: 'Label',
			description: 'A human-readable name for the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'catalogKind',
			label: 'catalog kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$artifacts',
			label: 'artifacts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AiArtifact,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$documents',
			label: 'documents',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AiDocument,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType._GlobalAiArtifactCatalog_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
