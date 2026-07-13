// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadRoomSelector {
	Id = 'Id',
}
export const BlockheadRoom = entity({
	entityType: EntityType.BlockheadRoom,
	labels: {
		singular: 'room',
		plural: 'rooms',
	},
})({
	id: {
		label: 'ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	createdBy: {
		label: 'Created by',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$peers: {
		label: 'Peers',
		type: EntityFieldType.EntitiesReference,
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
