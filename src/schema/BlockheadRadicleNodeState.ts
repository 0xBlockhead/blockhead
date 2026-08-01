// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadRadicleNodeState,
	labels: {
		singular: 'blockhead radicle node state',
		plural: 'blockhead radicle node states',
	},
})({
	connectionId: {
		label: 'connection ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	nodeId: {
		label: 'node ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	did: {
		label: 'DID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publicKey: {
		label: 'public key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	homePath: {
		label: 'home path',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$peers: {
		label: 'peers',
		entityType: EntityType.BlockheadRadiclePeer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$inventoryTimestamps: {
		label: 'inventory timestamps',
		entityType: EntityType.BlockheadRadicleNodeInventory_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$seedObservations: {
		label: 'seed observations',
		entityType: EntityType.BlockheadRadicleSeedObservation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$syncSessions: {
		label: 'sync sessions',
		entityType: EntityType.BlockheadRadicleSyncSession,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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
