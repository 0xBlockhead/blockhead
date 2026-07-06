// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ActivityPubActor_TimestampSelector {
	ActivityPubActorTimestampMs = 'ActivityPubActorTimestampMs',
}
export default {
	entityType: EntityType.ActivityPubActor_Timestamp,
	label: 'ActivityPub actor observation',
	labelPlural: 'ActivityPub actor observations',
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
			label: 'Actor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ActivityPubActor,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'followersCount',
			label: 'Followers',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'followingCount',
			label: 'Following',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'statusesCount',
			label: 'Statuses',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
