// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadRadiclePeerSelector {
	NodePeerNodeId = 'NodePeerNodeId',
}
export const BlockheadRadiclePeer = entity({
	entityType: EntityType.BlockheadRadiclePeer,
	label: 'blockhead radicle peer',
	labelPlural: 'blockhead radicle peers',
})({
	$node: {
		label: 'node',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadRadicleNodeState,
		cardinality: EntityFieldCardinality.One,
	},
	peerNodeId: {
		label: 'peer node ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	connectionKind: {
		label: 'connection kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	addresses: {
		label: 'addresses',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	lastSeenMs: {
		label: 'last seen ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	remoteAlias: {
		label: 'remote alias',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	remoteDid: {
		label: 'remote DID',
		type: EntityFieldType.Primitive,
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
