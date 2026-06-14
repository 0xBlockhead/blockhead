import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum BlockheadSocialPostSessionSelector {
	Id = 'id',
}


export enum SocialProtocol {
	Farcaster = 'Farcaster',
}

export enum BlockheadSocialPostSessionStatus {
	Draft = 'Draft',
	Submitted = 'Submitted',
	Finalized = 'Finalized',
}

export default {
	entityType: EntityType.BlockheadSocialPostSession,

	label: 'Social Post Session',
	labelPlural: 'Social Post Sessions',

	selectors: [
		{
			name: BlockheadSocialPostSessionSelector.Id,
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
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(BlockheadSocialPostSessionStatus),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'protocol',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(SocialProtocol),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'authorId',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'createdAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'updatedAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'lockedAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
