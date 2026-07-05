// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadRadiclePeerSelector {
	NodePeerNodeId = 'NodePeerNodeId',
}
export default {
	entityType: EntityType.BlockheadRadiclePeer,
	label: 'blockhead radicle peer',
	labelPlural: 'blockhead radicle peers',
	selectors: [
		{
			name: BlockheadRadiclePeerSelector.NodePeerNodeId,
			fields: [
				'$node',
				'peerNodeId',
			],
		},
	],
	fields: [
		{
				name: '$node',
				label: 'node',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BlockheadRadicleNodeState,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'peerNodeId',
				label: 'peer node ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'connectionKind',
				label: 'connection kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'addresses',
				label: 'addresses',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'lastSeenMs',
				label: 'last seen ms',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'remoteAlias',
				label: 'remote alias',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'remoteDid',
				label: 'remote DID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
