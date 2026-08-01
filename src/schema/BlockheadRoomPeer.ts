// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadRoomPeer,
	labels: {
		singular: 'contact',
		plural: 'contacts',
	},
})({
	id: {
		label: 'ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$room: {
		label: 'Room',
		entityType: EntityType.BlockheadRoom,
		cardinality: EntityFieldCardinality.One,
	},
	peerId: {
		label: 'Peer ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	displayName: {
		label: 'Display name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	joinedAt: {
		label: 'Joined',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	lastSeenAt: {
		label: 'Last seen',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	connectedAt: {
		label: 'Connected',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	disconnectedAt: {
		label: 'Disconnected',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isConnected: {
		label: 'Connected',
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
