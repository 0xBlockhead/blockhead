import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum XPostSelector {
	Id = 'id',
}
export default {
	entityType: EntityType.XPost,
	label: 'X post',
	labelPlural: 'X posts',
	selectors: [
		{
			name: XPostSelector.Id,
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
			name: '$author',
			label: 'author',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.XUser,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'text',
			label: 'text',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'conversationId',
			label: 'conversation ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$replyToPost',
			label: 'reply to post',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.XPost,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$quotedPost',
			label: 'quoted post',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.XPost,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'postUrl',
			label: 'post URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$media',
			label: 'media',
			labelPlural: 'mediases',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.XPost_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
