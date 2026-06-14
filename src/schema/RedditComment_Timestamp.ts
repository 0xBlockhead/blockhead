import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import RedditComment from '$/schema/RedditComment.ts'
import { Source } from '$/sources/Source.ts'

export enum RedditComment_TimestampSelector {
	RedditCommentTimestampMs = 'redditCommentTimestampMs',
}

export default {
	entityType: EntityType.RedditComment_Timestamp,

	label: 'Reddit comment snapshot',
	labelPlural: 'Reddit comment snapshots',

	selectors: [
		{
			name: RedditComment_TimestampSelector.RedditCommentTimestampMs,
			fields: [
				'$comment',
				'timestampMs',
			],
		},
	],

	fields: [
		{
			name: '$comment',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RedditComment,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'score',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Reddit_Rest,
				Source.Reddit_PublicJson,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
