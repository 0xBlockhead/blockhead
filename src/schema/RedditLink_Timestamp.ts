// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RedditLink_TimestampSelector {
	LinkTimestampMsSource = 'LinkTimestampMsSource',
}
export const RedditLink_Timestamp = entity({
	entityType: EntityType.RedditLink_Timestamp,
	labels: {
		singular: 'Reddit submission timestamp',
		plural: 'Reddit submission observations',
	},
})({
	$link: {
		label: 'Submission',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.RedditLink,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
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
	commentCount: {
		label: 'Comments',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		LinkTimestampMsSource: [
			'$link',
			'timestampMs',
			'source',
		],
	},
})
