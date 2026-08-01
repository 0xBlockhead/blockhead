// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadRadiclePeer,
	labels: {
		singular: 'blockhead radicle peer',
		plural: 'blockhead radicle peers',
	},
})({
	$node: {
		entityType: EntityType.BlockheadRadicleNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	peerNodeId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	connectionKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	addresses: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	lastSeenMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	remoteAlias: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	remoteDid: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NodePeerNodeId: [
			'$node',
			'peerNodeId',
		],
	},
})
