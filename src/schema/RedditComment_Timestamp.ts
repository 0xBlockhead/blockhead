// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RedditComment_TimestampSelector {
	CommentTimestampMsSource = 'CommentTimestampMsSource',
}
export default {
	entityType: EntityType.RedditComment_Timestamp,
	label: 'Reddit comment timestamp',
	labelPlural: 'Reddit comment observations',
	selectors: [
		{
			name: RedditComment_TimestampSelector.CommentTimestampMsSource,
			fields: [
				'$comment',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$comment',
			label: 'Comment',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RedditComment,
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
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'score',
			label: 'Score',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
