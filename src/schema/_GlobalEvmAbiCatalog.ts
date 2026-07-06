// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum _GlobalEvmAbiCatalogSelector {
	Scope = 'Scope',
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
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$sourceWindowTopics',
			label: 'source window topics',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmTopic,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Local_Internal,
			],
		},
		{
			name: '$$sourceWindowSelectors',
			label: 'source window selectors',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmSelector,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Local_Internal,
			],
		},
		{
			name: '$$sourceWindowErrors',
			label: 'source window errors',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmError,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Local_Internal,
			],
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType._GlobalEvmAbiCatalog_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Local_Internal,
			],
		},
	],
} as const satisfies EntityDefinition
