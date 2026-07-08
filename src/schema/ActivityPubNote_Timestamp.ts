// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ActivityPubNote_TimestampSelector {
	ActivityPubNoteTimestampMs = 'ActivityPubNoteTimestampMs',
}
export const ActivityPubNote_Timestamp = entity({
	entityType: EntityType.ActivityPubNote_Timestamp,
	label: 'ActivityPub note observation',
	labelPlural: 'ActivityPub note observations',
})({
	$note: {
		label: 'Note',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ActivityPubNote,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	favouriteCount: {
		label: 'Favourites',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reblogCount: {
		label: 'Reblogs',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	replyCount: {
		label: 'Replies',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ActivityPubNoteTimestampMs: [
			'$note',
			'timestampMs',
		],
	},
})
