import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import ActivityPubNote from '$/schema/ActivityPubNote.ts'
import { Source } from '$/sources/Source.ts'

export enum ActivityPubNote_TimestampSelector {
	ActivityPubNoteTimestampMs = 'activityPubNoteTimestampMs',
}

export default {
	entityType: EntityType.ActivityPubNote_Timestamp,

	label: 'ActivityPub note snapshot',
	labelPlural: 'ActivityPub note snapshots',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ActivityPubNote,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'favouriteCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Mastodon_Rest,
				Source.Fedi_Rest,
			],
		},
		{
			name: 'reblogCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Mastodon_Rest,
				Source.Fedi_Rest,
			],
		},
		{
			name: 'replyCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Mastodon_Rest,
				Source.Fedi_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
