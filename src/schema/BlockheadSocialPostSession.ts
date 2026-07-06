// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SocialProtocol {
	Farcaster = 'Farcaster',
}
export enum BlockheadSocialPostSessionStatus {
	Draft = 'Draft',
	Submitted = 'Submitted',
	Finalized = 'Finalized',
}
export enum BlockheadSocialPostSessionSelector {
	Id = 'Id',
}
export default {
	entityType: EntityType.BlockheadSocialPostSession,
	label: 'blockhead social post session',
	labelPlural: 'blockhead social post sessions',
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
			label: 'ID',
			description: 'The identifier assigned by the source domain.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type.enumerated(...Object.values(BlockheadSocialPostSessionStatus)),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'protocol',
			label: 'protocol',
			type: EntityFieldType.Primitive,
			primitiveType: type.enumerated(...Object.values(SocialProtocol)),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'authorId',
			label: 'author ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'updatedAt',
			label: 'Updated',
			description: 'The time when the subject was last updated according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'lockedAt',
			label: 'locked AT',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
