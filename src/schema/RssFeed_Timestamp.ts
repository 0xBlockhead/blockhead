// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum RssFeed_TimestampSelector {
	FeedTimestampMsSource = 'FeedTimestampMsSource',
}
export const RssFeed_Timestamp = entity({
	entityType: EntityType.RssFeed_Timestamp,
	label: 'RSS feed observation',
	labelPlural: 'RSS feed observations',
})({
	$feed: {
		label: 'Feed',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.RssFeed,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	reachable: {
		label: 'Reachable',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	observedItemCount: {
		label: 'Observed items',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fetchWindowKind: {
		label: 'Fetch window',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		FeedTimestampMsSource: [
			'$feed',
			'timestampMs',
			'source',
		],
	},
})
