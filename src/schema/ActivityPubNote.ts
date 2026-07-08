// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ActivityPubNoteSelector {
	ActivityStreamsUri = 'ActivityStreamsUri',
	InstanceOriginLocalStatusId = 'InstanceOriginLocalStatusId',
}
export const ActivityPubNote = entity({
	entityType: EntityType.ActivityPubNote,
	label: 'ActivityPub note',
	labelPlural: 'ActivityPub notes',
})({
	instanceOrigin: {
		label: 'Instance origin',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	localStatusId: {
		label: 'Local status ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$author: {
		label: 'Author',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ActivityPubActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	content: {
		label: 'Content',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	editedAt: {
		label: 'Edited',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	activityStreamsUri: {
		label: 'ActivityStreams URI',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	visibility: {
		label: 'Visibility',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sensitive: {
		label: 'Sensitive',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	language: {
		label: 'Language',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spoilerText: {
		label: 'Spoiler text',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	statusUrl: {
		label: 'Status URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$inReplyTo: {
		label: 'In reply to',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ActivityPubNote,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$reblogOf: {
		label: 'Reblog of',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ActivityPubNote,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$media: {
		label: 'Media',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.Many,
	},
	$$thread: {
		label: 'Thread',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ActivityPubNote,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.ActivityPubNote_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ActivityStreamsUri: [
			'activityStreamsUri',
		],
		InstanceOriginLocalStatusId: [
			'instanceOrigin',
			'localStatusId',
		],
	},
})
