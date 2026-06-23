import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum ActivityPubNote_TimestampSelector {
	ActivityPubNoteTimestampMs = 'activityPubNoteTimestampMs',
	NoteTimestampMs = '$note+timestampMs',
}
export default {
	entityType: EntityType.ActivityPubNote_Timestamp,
	label: 'activity pub note timestamp',
	labelPlural: 'activity pub note observations',
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
			label: 'note',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ActivityPubNote,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'favouriteCount',
			label: 'favourite count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'reblogCount',
			label: 'reblog count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'replyCount',
			label: 'reply count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
