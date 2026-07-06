// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadRoomSelector {
	Id = 'Id',
}
export default {
	entityType: EntityType.BlockheadRoom,
	label: 'room',
	labelPlural: 'rooms',
	selectors: [
		{
			name: BlockheadRoomSelector.Id,
			fields: [
				'id',
			],
		},
	],
	fields: [
		{
			name: 'id',
			label: 'ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			label: 'Created',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'createdBy',
			label: 'Created by',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$peers',
			label: 'Peers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadRoomPeer,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	],
} as const satisfies EntityDefinition
