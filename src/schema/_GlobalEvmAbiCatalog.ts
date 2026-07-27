// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType._GlobalEvmAbiCatalog,
	labels: {
		singular: 'global EVM ABI catalog',
		plural: 'global EVM ABI catalogs',
	},
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
