// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ActivityPubNote_TimestampSelector {
	ActivityPubNoteTimestampMs = 'ActivityPubNoteTimestampMs',
}
export default {
	entityType: EntityType.ActivityPubNote_Timestamp,
	label: 'ActivityPub note observation',
	labelPlural: 'ActivityPub note observations',
	selectors: [
		{
			name: ActivityPubNote_TimestampSelector.ActivityPubNoteTimestampMs,
			fields: [
				'$note',
				'timestampMs',
			],
		},
	],
	fields: [
		{
			name: '$note',
			label: 'Note',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ActivityPubNote,
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
			name: 'favouriteCount',
			label: 'Favourites',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'reblogCount',
			label: 'Reblogs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'replyCount',
			label: 'Replies',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
