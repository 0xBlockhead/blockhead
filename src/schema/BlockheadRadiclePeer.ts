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
		label: 'node',
		entityType: EntityType.BlockheadRadicleNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	peerNodeId: {
		label: 'peer node ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	connectionKind: {
		label: 'connection kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	addresses: {
		label: 'addresses',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	lastSeenMs: {
		label: 'last seen ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	remoteAlias: {
		label: 'remote alias',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	remoteDid: {
		label: 'remote DID',
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
