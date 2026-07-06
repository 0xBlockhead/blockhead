// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AtprotoPost_TimestampSelector {
	AtprotoPostTimestampMs = 'AtprotoPostTimestampMs',
}
export default {
	entityType: EntityType.AtprotoPost_Timestamp,
	label: 'AT Protocol post observation',
	labelPlural: 'AT Protocol post observations',
	selectors: [
		{
			name: AtprotoPost_TimestampSelector.AtprotoPostTimestampMs,
			fields: [
				'$post',
				'timestampMs',
			],
		},
	],
	fields: [
		{
			name: '$post',
			label: 'Post',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AtprotoPost,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'likeCount',
			label: 'Likes',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'repostCount',
			label: 'Reposts',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'replyCount',
			label: 'Replies',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'quoteCount',
			label: 'Quotes',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
