// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum _GlobalEvmAbiCatalogSelector {
	Scope = 'Scope',
}
export const _GlobalEvmAbiCatalog = entity({
	entityType: EntityType._GlobalEvmAbiCatalog,
	label: 'global EVM ABI catalog',
	labelPlural: 'global EVM ABI catalogs',
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedTopics: {
		label: 'observed topics',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmTopic,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
	$$observedSelectors: {
		label: 'observed selectors',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmSelector,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
	$$observedErrors: {
		label: 'observed errors',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmError,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType._GlobalEvmAbiCatalog_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})
