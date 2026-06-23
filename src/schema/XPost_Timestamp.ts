import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum XPost_TimestampSelector {
	XPostTimestampMs = 'xPostTimestampMs',
	PostTimestampMs = '$post+timestampMs',
}
export default {
	entityType: EntityType.XPost_Timestamp,
	label: 'X post timestamp',
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
			label: 'post',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.XPost,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'likeCount',
			label: 'like count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'retweetCount',
			label: 'retweet count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'replyCount',
			label: 'reply count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'quoteCount',
			label: 'quote count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
