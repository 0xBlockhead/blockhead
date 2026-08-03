// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const localInternalSources = [
	Source.Local_Internal,
] as const

export default entity({
	entityType: EntityType._GlobalEvmAbiCatalog,
	labels: {
		singular: 'global EVM ABI catalog',
		plural: 'global EVM ABI catalogs',
	},
})({
	scope: {
		primitiveType: type.unit('_GlobalEvmAbiCatalog'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedTopics: {
		entityType: EntityType.EvmTopic,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: localInternalSources,
	},
	$$observedSelectors: {
		entityType: EntityType.EvmSelector,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: localInternalSources,
	},
	$$observedErrors: {
		entityType: EntityType.EvmError,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: localInternalSources,
	},
	$$timestamps: {
		entityType: EntityType._GlobalEvmAbiCatalog_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: localInternalSources,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})
