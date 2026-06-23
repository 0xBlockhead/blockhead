import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadRoomSelector {
	Id = 'id',
}
export default {
	entityType: EntityType.BlockheadRoom,
	label: 'blockhead room',
	labelPlural: 'blockhead rooms',
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
			description: 'The identifier assigned by the source domain.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'createdBy',
			label: 'created by',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$peers',
			label: 'peers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadRoomPeer,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	],
} as const satisfies EntityDefinition
