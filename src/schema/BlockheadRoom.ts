import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum BlockheadRoomSelector {
	Id = 'id',
}

export default {
	entityType: EntityType.BlockheadRoom,

	label: 'Room',
	labelPlural: 'Rooms',

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
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'createdAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'createdBy',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$peers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadRoomPeer,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
