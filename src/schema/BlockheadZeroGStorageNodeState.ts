// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum BlockheadZeroGStorageNodeStateSelector {
	ConnectionIdNetworkNodeId = 'ConnectionIdNetworkNodeId',
}
export default {
	entityType: EntityType.BlockheadZeroGStorageNodeState,
	label: 'blockhead zero g storage node state',
	labelPlural: 'blockhead zero g storage node states',
	selectors: [
		{
			name: BlockheadZeroGStorageNodeStateSelector.ConnectionIdNetworkNodeId,
			fields: [
				'connectionId',
				'$network',
				'nodeId',
			],
		},
	],
	fields: [
		{
			name: 'connectionId',
			label: 'connection ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'nodeId',
			label: 'node ID',
			type: EntityFieldType.Primitive,
			primitiveType: (EvmAddress),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'endpoint',
			label: 'endpoint',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'storagePath',
			label: 'storage path',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$localChunks',
			label: 'local chunks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadZeroGStoredChunk,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$localProofs',
			label: 'local proofs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadZeroGStorageProof,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadZeroGStorageNodeState_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
