// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ActivityPubNoteSelector {
	ActivityStreamsUri = 'ActivityStreamsUri',
	InstanceOriginLocalStatusId = 'InstanceOriginLocalStatusId',
}
export default {
	entityType: EntityType.ActivityPubNote,
	label: 'ActivityPub note',
	labelPlural: 'ActivityPub notes',
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
			label: 'Instance origin',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'localStatusId',
			label: 'Local status ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$author',
			label: 'Author',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ActivityPubActor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'content',
			label: 'Content',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			label: 'Created',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'editedAt',
			label: 'Edited',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activityStreamsUri',
			label: 'ActivityStreams URI',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'visibility',
			label: 'Visibility',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sensitive',
			label: 'Sensitive',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'language',
			label: 'Language',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'spoilerText',
			label: 'Spoiler text',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'statusUrl',
			label: 'Status URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$inReplyTo',
			label: 'In reply to',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ActivityPubNote,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$reblogOf',
			label: 'Reblog of',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ActivityPubNote,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$media',
			label: 'Media',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$thread',
			label: 'Thread',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ActivityPubNote,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ActivityPubNote_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
