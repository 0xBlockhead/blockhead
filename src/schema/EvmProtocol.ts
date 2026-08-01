// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmProtocol,
	labels: {
		singular: 'EVM protocol',
		plural: 'EVM protocols',
	},
	description: 'Catalog surface for EVM signature, topic, and error registries.',
})({
	scope: {
		label: 'Scope',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		label: 'Protocol name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	homeUrl: {
		label: 'Home URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	docsUrl: {
		label: 'Docs URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registryName: {
		label: 'Registry name name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	relationshipModel: {
		label: 'Connection model',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$evmTopics: {
		label: 'EVM topics',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmTopic,
		cardinality: EntityFieldCardinality.Many,
	},
	$$evmSelectors: {
		label: 'EVM selectors',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmSelector,
		cardinality: EntityFieldCardinality.Many,
	},
	$$evmErrors: {
		label: 'EVM errors',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.EvmError,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})
