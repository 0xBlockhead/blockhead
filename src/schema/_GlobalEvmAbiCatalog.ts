import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum _GlobalEvmAbiCatalogSelector {
	Scope = 'scope',
}
export default {
	entityType: EntityType._GlobalEvmAbiCatalog,
	label: 'global EVM ABI catalog',
	labelPlural: 'global EVM ABI catalogs',
	selectors: [
		{
			name: _GlobalEvmAbiCatalogSelector.Scope,
			fields: [
				'scope',
			],
		},
	],
	fields: [
		{
			name: 'scope',
			label: 'Scope',
			description: 'The fixed scope value that identifies this hub row.',
			type: EntityFieldType.Primitive,
			primitiveType: type("'_GlobalEvmAbiCatalog'"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$sourceWindowTopics',
			label: 'source window topics',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmTopic,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$sourceWindowSelectors',
			label: 'source window selectors',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmSelector,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$sourceWindowErrors',
			label: 'source window errors',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmError,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType._GlobalEvmAbiCatalog_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
