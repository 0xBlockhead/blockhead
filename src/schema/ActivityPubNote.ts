import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum ActivityPubNoteSelector {
	ActivityStreamsUri = 'activityStreamsUri',
	InstanceOriginLocalStatusId = 'instanceOriginLocalStatusId',
}
export default {
	entityType: EntityType.ActivityPubNote,
	label: 'activity pub note',
	labelPlural: 'activity pub notes',
	selectors: [
		{
			name: ActivityPubNoteSelector.ActivityStreamsUri,
			fields: [
				'activityStreamsUri',
			],
		},
		{
			name: ActivityPubNoteSelector.InstanceOriginLocalStatusId,
			fields: [
				'instanceOrigin',
				'localStatusId',
			],
		},
	],
	fields: [
		{
			name: 'instanceOrigin',
			label: 'instance origin',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'localStatusId',
			label: 'local status ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$author',
			label: 'author',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ActivityPubActor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'content',
			label: 'content',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'editedAt',
			label: 'edited AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activityStreamsUri',
			label: 'activity streams URI',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ActivityPubNote_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'visibility',
			label: 'visibility',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sensitive',
			label: 'sensitive',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'language',
			label: 'language',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'spoilerText',
			label: 'spoiler text',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'statusUrl',
			label: 'status URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$inReplyTo',
			label: 'in reply to',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ActivityPubNote,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$reblogOf',
			label: 'reblog of',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ActivityPubNote,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$media',
			label: 'media',
			labelPlural: 'mediases',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$thread',
			label: 'thread',
			labelPlural: 'threadses',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ActivityPubNote,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
