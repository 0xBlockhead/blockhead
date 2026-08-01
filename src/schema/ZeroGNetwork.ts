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
		label: 'Slug',
		description: 'A stable short name used by catalogs and URLs.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	namespace: {
		label: 'Namespace',
		description: 'The namespace that qualifies the identifier.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	environment: {
		label: 'environment',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	chainId: {
		label: 'Chain ID',
		description: 'The chain identifier used by the network family.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$executionNetwork: {
		label: 'execution network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$consensusNetwork: {
		label: 'consensus network',
		entityType: EntityType.ZeroGConsensusNetwork,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.ZeroGNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$storageNodes: {
		label: 'storage nodes',
		entityType: EntityType.ZeroGStorageNode,
		cardinality: EntityFieldCardinality.Many,
	},
	$$dataBlobs: {
		label: 'data blobs',
		entityType: EntityType.ZeroGDataBlob,
		cardinality: EntityFieldCardinality.Many,
	},
	$$daQuorums: {
		label: 'DA quorums',
		entityType: EntityType.ZeroGDaQuorum,
		cardinality: EntityFieldCardinality.Many,
	},
	$$daNodes: {
		label: 'DA nodes',
		entityType: EntityType.ZeroGDaNode,
		cardinality: EntityFieldCardinality.Many,
	},
	$$kvEntries: {
		label: 'KV entries',
		entityType: EntityType.ZeroGKvEntry,
		cardinality: EntityFieldCardinality.Many,
	},
	$$serviceProviders: {
		label: 'service providers',
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
