import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AtprotoPost_TimestampSelector {
	AtprotoPostTimestampMs = 'atprotoPostTimestampMs',
	PostTimestampMs = '$post+timestampMs',
}
export default {
	entityType: EntityType.AtprotoPost_Timestamp,
	label: 'atproto post timestamp',
	labelPlural: 'atproto post observations',
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
			label: 'post',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AtprotoPost,
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
			name: 'repostCount',
			label: 'repost count',
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
