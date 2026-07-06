// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RadicleDiscussionCommentSelector {
	DiscussionSelectorCommentId = 'DiscussionSelectorCommentId',
}
export default {
	entityType: EntityType.RadicleDiscussionComment,
	label: 'radicle discussion comment',
	labelPlural: 'radicle discussion comments',
	selectors: [
		{
			name: RadicleDiscussionCommentSelector.DiscussionSelectorCommentId,
			fields: [
				'discussionSelector',
				'commentId',
			],
		},
	],
	fields: [
		{
			name: 'discussionSelector',
			label: 'discussion selector',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'commentId',
			label: 'comment ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'authorDid',
			label: 'author DID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'body',
			label: 'body',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'bodyObjectId',
			label: 'body object ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'updatedAt',
			label: 'Updated',
			description: 'The time when the subject was last updated according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'replyToCommentId',
			label: 'reply to comment ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$payloadObject',
			label: 'payload object',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.GitObject,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
