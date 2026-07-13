// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum LensAccount_TimestampSelector {
	LensAccountTimestampMs = 'LensAccountTimestampMs',
}
export const LensAccount_Timestamp = entity({
	entityType: EntityType.LensAccount_Timestamp,
	labels: {
		singular: 'Lens account observation',
		plural: 'Lens account observations',
	},
})({
	$account: {
		label: 'Account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LensAccount,
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
})({
	selectors: {
		LensAccountTimestampMs: [
			'$account',
			'timestampMs',
		],
	},
})
