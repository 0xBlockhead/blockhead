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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	nodeId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	did: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publicKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	homePath: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$peers: {
		entityType: EntityType.BlockheadRadiclePeer,
		cardinality: EntityFieldCardinality.Many,
	},
	$$inventoryTimestamps: {
		entityType: EntityType.BlockheadRadicleNodeInventory_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$seedObservations: {
		entityType: EntityType.BlockheadRadicleSeedObservation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$syncSessions: {
		entityType: EntityType.BlockheadRadicleSyncSession,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
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
