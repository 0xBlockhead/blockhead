// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum ActivityPubActorSelector {
	ActivityStreamsUri = 'ActivityStreamsUri',
	LocalAccountId = 'LocalAccountId',
	Acct = 'Acct',
}
export default {
	entityType: EntityType.ActivityPubActor,
	label: 'ActivityPub actor',
	labelPlural: 'ActivityPub actors',
	selectors: [
		{
			name: ActivityPubActorSelector.ActivityStreamsUri,
			fields: [
				'activityStreamsUri',
			],
		},
		{
			name: ActivityPubActorSelector.LocalAccountId,
			fields: [
				'instanceOrigin',
				'localAccountId',
			],
		},
		{
			name: ActivityPubActorSelector.Acct,
			fields: [
				'instanceOrigin',
				'acct',
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
				name: 'localAccountId',
				label: 'Local account ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'username',
				label: 'Username',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'acct',
				label: 'acct',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'displayName',
				label: 'Display name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'note',
				label: 'Note',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$icon',
				label: 'Icon',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Media,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$headerImage',
				label: 'Header image',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Media,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'profileUrl',
				label: 'Profile URL',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
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
				name: 'website',
				label: 'Website',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'bot',
				label: 'Bot',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'locked',
				label: 'Locked',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
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
				name: '$$timestamps',
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ActivityPubActor_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$notes',
				label: 'Notes',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.ActivityPubNote,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Mastodon_Rest,
					Source.Fedi_Rest,
				],
		},
	],
} as const satisfies EntityDefinition
