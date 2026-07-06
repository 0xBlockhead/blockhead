// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum ZeroGStorageNodeSelector {
	NetworkNodeId = 'NetworkNodeId',
}
export default {
	entityType: EntityType.ZeroGStorageNode,
	label: 'zero g storage node',
	labelPlural: 'zero g storage nodes',
	selectors: [
		{
			name: ZeroGStorageNodeSelector.NetworkNodeId,
			fields: [
				'$network',
				'nodeId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
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
			name: '$operator',
			label: 'operator',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'endpoint',
			label: 'endpoint',
			type: EntityFieldType.Primitive,
			primitiveType: (UrlString),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGStorageNode_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.ZeroGStorageScan_Rest,
			],
		},
		{
			name: '$$storedChunks',
			label: 'stored chunks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGDataChunk,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$proofs',
			label: 'proofs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ZeroGStorageProof,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
