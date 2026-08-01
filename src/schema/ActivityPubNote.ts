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
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	localStatusId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$author: {
		entityType: EntityType.ActivityPubActor,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	content: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	editedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	activityStreamsUri: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	visibility: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sensitive: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	language: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spoilerText: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	statusUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$inReplyTo: {
		entityType: EntityType.ActivityPubNote,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$reblogOf: {
		entityType: EntityType.ActivityPubNote,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$media: {
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.Many,
	},
	$$thread: {
		entityType: EntityType.ActivityPubNote,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
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
