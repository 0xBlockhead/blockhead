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
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		primitiveType: type.unit('_GlobalEvmAbiCatalog'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedTopics: {
		label: 'observed topics',
		entityType: EntityType.EvmTopic,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
	$$observedSelectors: {
		label: 'observed selectors',
		entityType: EntityType.EvmSelector,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
	$$observedErrors: {
		label: 'observed errors',
		entityType: EntityType.EvmError,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Local_Internal,
		],
	},
	$$timestamps: {
		label: 'timestamps',
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
