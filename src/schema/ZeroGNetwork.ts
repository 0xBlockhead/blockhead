// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ZeroGNetworkSelector {
	Slug = 'Slug',
}
export const ZeroGNetwork = entity({
	entityType: EntityType.ZeroGNetwork,
	label: 'zero g network',
	labelPlural: 'zero g networks',
})({
	slug: {
		label: 'Slug',
		description: 'A stable short name used by catalogs and URLs.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	namespace: {
		label: 'Namespace',
		description: 'The namespace that qualifies the identifier.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	environment: {
		label: 'environment',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	chainId: {
		label: 'Chain ID',
		description: 'The chain identifier used by the network family.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$executionNetwork: {
		label: 'execution network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$consensusNetwork: {
		label: 'consensus network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ZeroGConsensusNetwork,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ZeroGNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$storageNodes: {
		label: 'storage nodes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ZeroGStorageNode,
		cardinality: EntityFieldCardinality.Many,
	},
	$$dataBlobs: {
		label: 'data blobs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ZeroGDataBlob,
		cardinality: EntityFieldCardinality.Many,
	},
	$$daQuorums: {
		label: 'DA quorums',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ZeroGDaQuorum,
		cardinality: EntityFieldCardinality.Many,
	},
	$$daNodes: {
		label: 'DA nodes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ZeroGDaNode,
		cardinality: EntityFieldCardinality.Many,
	},
	$$kvEntries: {
		label: 'KV entries',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ZeroGKvEntry,
		cardinality: EntityFieldCardinality.Many,
	},
	$$serviceProviders: {
		label: 'service providers',
		type: EntityFieldType.EntitiesReference,
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
