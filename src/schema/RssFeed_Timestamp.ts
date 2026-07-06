// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RssFeed_TimestampSelector {
	FeedTimestampMsSource = 'FeedTimestampMsSource',
}
export default {
	entityType: EntityType.RssFeed_Timestamp,
	label: 'RSS feed observation',
	labelPlural: 'RSS feed observations',
	selectors: [
		{
			name: RssFeed_TimestampSelector.FeedTimestampMsSource,
			fields: [
				'$feed',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$feed',
			label: 'Feed',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RssFeed,
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
			name: 'source',
			label: 'Source',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'reachable',
			label: 'Reachable',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sourceWindowItemCount',
			label: 'Source window items',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'fetchWindowKind',
			label: 'Fetch window',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
