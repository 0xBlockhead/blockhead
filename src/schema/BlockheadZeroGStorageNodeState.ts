// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadZeroGStorageNodeStateSelector {
	ConnectionIdNetworkNodeId = 'ConnectionIdNetworkNodeId',
}
export const BlockheadZeroGStorageNodeState = entity({
	entityType: EntityType.BlockheadZeroGStorageNodeState,
	labels: {
		singular: 'blockhead zero g storage node state',
		plural: 'blockhead zero g storage node states',
	},
})({
	connectionId: {
		label: 'connection ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ZeroGNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	nodeId: {
		label: 'node ID',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.One,
	},
	endpoint: {
		label: 'endpoint',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	storagePath: {
		label: 'storage path',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$localChunks: {
		label: 'local chunks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadZeroGStoredChunk,
		cardinality: EntityFieldCardinality.Many,
	},
	$$localProofs: {
		label: 'local proofs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadZeroGStorageProof,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadZeroGStorageNodeState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ConnectionIdNetworkNodeId: [
			'connectionId',
			'$network',
			'nodeId',
		],
	},
})
