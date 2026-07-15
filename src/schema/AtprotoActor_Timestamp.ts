// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum AtprotoActor_TimestampSelector {
	AtprotoActorTimestampMs = 'AtprotoActorTimestampMs',
}
export const AtprotoActor_Timestamp = entity({
	entityType: EntityType.AtprotoActor_Timestamp,
	labels: {
		singular: 'AT Protocol account observation',
		plural: 'AT Protocol account observations',
	},
})({
	$actor: {
		label: 'Account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AtprotoActor,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	followersCount: {
		label: 'Followers',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Atproto_Xrpc,
		],
	},
	followsCount: {
		label: 'Following',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Atproto_Xrpc,
		],
	},
	postsCount: {
		label: 'Posts',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Atproto_Xrpc,
		],
	},
})({
	selectors: {
		AtprotoActorTimestampMs: [
			'$actor',
			'timestampMs',
		],
	},
})
