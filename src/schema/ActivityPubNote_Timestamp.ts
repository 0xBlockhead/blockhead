// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ActivityPubNote_Timestamp,
	labels: {
		singular: 'ActivityPub note observation',
		plural: 'ActivityPub note observations',
	},
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
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
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
		ActivityPubNoteTimestampMsSource: [
			'$note',
			'timestampMs',
			'source',
		],
	},
})
