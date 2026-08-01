// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadRadicleSyncSession,
	labels: {
		singular: 'blockhead radicle sync session',
		plural: 'blockhead radicle sync sessions',
	},
})({
	sessionId: {
		label: 'session ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$localNode: {
		label: 'local node',
		entityType: EntityType.BlockheadRadicleNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	remoteNodeId: {
		label: 'remote node ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$repository: {
		label: 'repository',
		entityType: EntityType.RadicleRepository,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rid: {
		label: 'rid',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	startedAt: {
		label: 'started AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	completedAt: {
		label: 'completed AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestedRefs: {
		label: 'requested refs',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	receivedObjects: {
		label: 'received objects',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	error: {
		label: 'error',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SessionId: [
			'sessionId',
		],
	},
})
