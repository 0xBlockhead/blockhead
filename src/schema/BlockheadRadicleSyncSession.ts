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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$localNode: {
		entityType: EntityType.BlockheadRadicleNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	remoteNodeId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$repository: {
		entityType: EntityType.RadicleRepository,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	startedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	completedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	requestedRefs: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	receivedObjects: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	error: {
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
