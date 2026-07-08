// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadRadicleNodeStateSelector {
	ConnectionIdNodeId = 'ConnectionIdNodeId',
}
export const BlockheadRadicleNodeState = entity({
	entityType: EntityType.BlockheadRadicleNodeState,
	label: 'blockhead radicle node state',
	labelPlural: 'blockhead radicle node states',
})({
	connectionId: {
		label: 'connection ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	nodeId: {
		label: 'node ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	did: {
		label: 'DID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publicKey: {
		label: 'public key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	homePath: {
		label: 'home path',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$peers: {
		label: 'peers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadRadiclePeer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$inventoryTimestamps: {
		label: 'inventory timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadRadicleNodeInventory_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$seedObservations: {
		label: 'seed observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadRadicleSeedObservation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$syncSessions: {
		label: 'sync sessions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadRadicleSyncSession,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadRadicleNodeState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ConnectionIdNodeId: [
			'connectionId',
			'nodeId',
		],
	},
})
