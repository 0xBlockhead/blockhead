// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ActivityPubActor,
	labels: {
		singular: 'ActivityPub actor',
		plural: 'ActivityPub actors',
	},
})({
	instanceOrigin: {
		label: 'Instance origin',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	localAccountId: {
		label: 'Local account ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	username: {
		label: 'Username',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	acct: {
		label: 'acct',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	displayName: {
		label: 'Display name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	note: {
		label: 'Note',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		label: 'Icon',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$headerImage: {
		label: 'Header image',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	profileUrl: {
		label: 'Profile URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	activityStreamsUri: {
		label: 'ActivityStreams URI',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	website: {
		label: 'Website',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bot: {
		label: 'Bot',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	locked: {
		label: 'Locked',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.ActivityPubActor_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$notes: {
		label: 'Notes',
		entityType: EntityType.ActivityPubNote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Mastodon_Rest,
		],
	},
})({
	selectors: {
		ActivityStreamsUri: [
			'activityStreamsUri',
		],
		LocalAccountId: [
			'instanceOrigin',
			'localAccountId',
		],
		Acct: [
			'instanceOrigin',
			'acct',
		],
	},
})
