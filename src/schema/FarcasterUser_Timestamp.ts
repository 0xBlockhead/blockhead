// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum FarcasterUser_TimestampSelector {
	FarcasterUserTimestampMs = 'FarcasterUserTimestampMs',
}
export default {
	entityType: EntityType.FarcasterUser_Timestamp,
	label: 'Farcaster user observation',
	labelPlural: 'Farcaster user observations',
	selectors: [
		{
			name: FarcasterUser_TimestampSelector.FarcasterUserTimestampMs,
			fields: [
				'$user',
				'timestampMs',
			],
		},
	],
	fields: [
		{
			name: '$user',
			label: 'User',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterUser,
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
