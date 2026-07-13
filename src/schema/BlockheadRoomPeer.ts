// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadRoomPeerSelector {
	Id = 'Id',
}
export const BlockheadRoomPeer = entity({
	entityType: EntityType.BlockheadRoomPeer,
	labels: {
		singular: 'contact',
		plural: 'contacts',
	},
})({
	id: {
		label: 'ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$room: {
		label: 'Room',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadRoom,
		cardinality: EntityFieldCardinality.One,
	},
	peerId: {
		label: 'Peer ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	displayName: {
		label: 'Display name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	joinedAt: {
		label: 'Joined',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	lastSeenAt: {
		label: 'Last seen',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	connectedAt: {
		label: 'Connected',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	disconnectedAt: {
		label: 'Disconnected',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isConnected: {
		label: 'Connected',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
