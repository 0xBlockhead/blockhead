// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RedditLink_TimestampSelector {
	LinkTimestampMsSource = 'LinkTimestampMsSource',
}
export default {
	entityType: EntityType.RedditLink_Timestamp,
	label: 'Reddit submission timestamp',
	labelPlural: 'Reddit submission observations',
	selectors: [
		{
			name: RedditLink_TimestampSelector.LinkTimestampMsSource,
			fields: [
				'$link',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$link',
			label: 'Submission',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RedditLink,
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
		{
			name: 'commentCount',
			label: 'Comments',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
