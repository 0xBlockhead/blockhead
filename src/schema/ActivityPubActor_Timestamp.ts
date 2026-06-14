import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import ActivityPubActor from '$/schema/ActivityPubActor.ts'
import { Source } from '$/sources/Source.ts'

export enum ActivityPubActor_TimestampSelector {
	ActivityPubActorTimestampMs = 'activityPubActorTimestampMs',
}

export default {
	entityType: EntityType.ActivityPubActor_Timestamp,

	label: 'ActivityPub actor snapshot',
	labelPlural: 'ActivityPub actor snapshots',

	selectors: [
		{
			name: ActivityPubActor_TimestampSelector.ActivityPubActorTimestampMs,
			fields: [
				'$actor',
				'timestampMs',
			],
		},
	],

	fields: [
		{
			name: '$actor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ActivityPubActor,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'followersCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Mastodon_Rest,
				Source.Fedi_Rest,
			],
		},
		{
			name: 'followingCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Mastodon_Rest,
				Source.Fedi_Rest,
			],
		},
		{
			name: 'statusesCount',
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
