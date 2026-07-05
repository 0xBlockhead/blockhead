// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadRadicleNodeStateSelector {
	ConnectionIdNodeId = 'ConnectionIdNodeId',
}
export default {
	entityType: EntityType.BlockheadRadicleNodeState,
	label: 'blockhead radicle node state',
	labelPlural: 'blockhead radicle node states',
	selectors: [
		{
			name: BlockheadRadicleNodeStateSelector.ConnectionIdNodeId,
			fields: [
				'connectionId',
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
				name: 'nodeId',
				label: 'node ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'did',
				label: 'DID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'publicKey',
				label: 'public key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'homePath',
				label: 'home path',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$peers',
				label: 'peers',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadRadiclePeer,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$inventoryTimestamps',
				label: 'inventory timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadRadicleNodeInventory_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$seedObservations',
				label: 'seed observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadRadicleSeedObservation_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$syncSessions',
				label: 'sync sessions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadRadicleSyncSession,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadRadicleNodeState_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
