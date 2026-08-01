// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadRoom,
	labels: {
		singular: 'room',
		plural: 'rooms',
	},
})({
	id: {
		label: 'ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	createdBy: {
		label: 'Created by',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$peers: {
		label: 'Peers',
		entityType: EntityType.BlockheadRoomPeer,
		cardinality: EntityFieldCardinality.ZeroOrMany,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
