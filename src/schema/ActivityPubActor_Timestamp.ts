// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ActivityPubActor_TimestampSelector {
	ActivityPubActorTimestampMs = 'ActivityPubActorTimestampMs',
}
export const ActivityPubActor_Timestamp = entity({
	entityType: EntityType.ActivityPubActor_Timestamp,
	labels: {
		singular: 'ActivityPub actor observation',
		plural: 'ActivityPub actor observations',
	},
})({
	$actor: {
		label: 'Actor',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ActivityPubActor,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	followersCount: {
		label: 'Followers',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	followingCount: {
		label: 'Following',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	statusesCount: {
		label: 'Statuses',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ActivityPubActorTimestampMs: [
			'$actor',
			'timestampMs',
		],
	},
})
