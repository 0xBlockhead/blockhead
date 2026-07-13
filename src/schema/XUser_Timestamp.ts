// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum XUser_TimestampSelector {
	XUserTimestampMs = 'XUserTimestampMs',
}
export const XUser_Timestamp = entity({
	entityType: EntityType.XUser_Timestamp,
	labels: {
		singular: 'X user observation',
		plural: 'X user observations',
	},
})({
	$user: {
		label: 'User',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.XUser,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	followerCount: {
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
	tweetCount: {
		label: 'Tweets',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	listedCount: {
		label: 'Listed',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		XUserTimestampMs: [
			'$user',
			'timestampMs',
		],
	},
})
