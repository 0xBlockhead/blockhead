// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum LensAccount_TimestampSelector {
	LensAccountTimestampMs = 'LensAccountTimestampMs',
}
export default {
	entityType: EntityType.LensAccount_Timestamp,
	label: 'Lens account observation',
	labelPlural: 'Lens account observations',
	selectors: [
		{
			name: LensAccount_TimestampSelector.LensAccountTimestampMs,
			fields: [
				'$account',
				'timestampMs',
			],
		},
	],
	fields: [
		{
				name: '$account',
				label: 'Account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.LensAccount,
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
				name: 'followerCount',
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
	],
} as const satisfies EntityDefinition
