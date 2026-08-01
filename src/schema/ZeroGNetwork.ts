// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ZeroGNetwork,
	labels: {
		singular: 'zero g network',
		plural: 'zero g networks',
	},
})({
	slug: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	namespace: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	environment: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	chainId: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$executionNetwork: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$consensusNetwork: {
		entityType: EntityType.ZeroGConsensusNetwork,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.ZeroGNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$storageNodes: {
		entityType: EntityType.ZeroGStorageNode,
		cardinality: EntityFieldCardinality.Many,
	},
	$$dataBlobs: {
		entityType: EntityType.ZeroGDataBlob,
		cardinality: EntityFieldCardinality.Many,
	},
	$$daQuorums: {
		entityType: EntityType.ZeroGDaQuorum,
		cardinality: EntityFieldCardinality.Many,
	},
	$$daNodes: {
		entityType: EntityType.ZeroGDaNode,
		cardinality: EntityFieldCardinality.Many,
	},
	$$kvEntries: {
		entityType: EntityType.ZeroGKvEntry,
		cardinality: EntityFieldCardinality.Many,
	},
	$$serviceProviders: {
		entityType: EntityType.ZeroGServiceProvider,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Slug: [
			'slug',
		],
	},
})
