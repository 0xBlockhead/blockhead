// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ActivityPubNote,
	labels: {
		singular: 'ActivityPub note',
		plural: 'ActivityPub notes',
	},
})({
	instanceOrigin: {
		label: 'Instance origin',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	localStatusId: {
		label: 'Local status ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$author: {
		label: 'Author',
		entityType: EntityType.ActivityPubActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	content: {
		label: 'Content',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	editedAt: {
		label: 'Edited',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	activityStreamsUri: {
		label: 'ActivityStreams URI',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	visibility: {
		label: 'Visibility',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sensitive: {
		label: 'Sensitive',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	language: {
		label: 'Language',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spoilerText: {
		label: 'Spoiler text',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	statusUrl: {
		label: 'Status URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$inReplyTo: {
		label: 'In reply to',
		entityType: EntityType.ActivityPubNote,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$reblogOf: {
		label: 'Reblog of',
		entityType: EntityType.ActivityPubNote,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$media: {
		label: 'Media',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.Many,
	},
	$$thread: {
		label: 'Thread',
		entityType: EntityType.ActivityPubNote,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'Observations',
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
