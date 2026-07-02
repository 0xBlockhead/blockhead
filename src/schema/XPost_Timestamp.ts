// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum XPost_TimestampSelector {
	XPostTimestampMs = 'XPostTimestampMs',
}
export default {
	entityType: EntityType.XPost_Timestamp,
	label: 'X post observation',
	labelPlural: 'X post observations',
	selectors: [
		{
			name: XPost_TimestampSelector.XPostTimestampMs,
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
				entityType: EntityType.XPost,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
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
				name: 'retweetCount',
				label: 'Retweets',
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
