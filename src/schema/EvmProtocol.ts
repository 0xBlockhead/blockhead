// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	homeUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	docsUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registryName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	relationshipModel: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$evmTopics: {
		entityType: EntityType.EvmTopic,
		cardinality: EntityFieldCardinality.Many,
	},
	$$evmSelectors: {
		entityType: EntityType.EvmSelector,
		cardinality: EntityFieldCardinality.Many,
	},
	$$evmErrors: {
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
