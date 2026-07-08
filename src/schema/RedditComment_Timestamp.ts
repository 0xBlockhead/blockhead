// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RedditComment_TimestampSelector {
	CommentTimestampMsSource = 'CommentTimestampMsSource',
}
export const RedditComment_Timestamp = entity({
	entityType: EntityType.RedditComment_Timestamp,
	label: 'Reddit comment timestamp',
	labelPlural: 'Reddit comment observations',
})({
	$comment: {
		label: 'Comment',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.RedditComment,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	score: {
		label: 'Score',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		CommentTimestampMsSource: [
			'$comment',
			'timestampMs',
			'source',
		],
	},
})
