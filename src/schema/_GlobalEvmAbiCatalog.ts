// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type.unit('_GlobalEvmAbiCatalog'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedTopics: {
		entityType: EntityType.EvmTopic,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
	$$observedSelectors: {
		entityType: EntityType.EvmSelector,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
	$$observedErrors: {
		entityType: EntityType.EvmError,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
	$$timestamps: {
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
