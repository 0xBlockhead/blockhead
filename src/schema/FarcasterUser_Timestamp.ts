import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import FarcasterUser from '$/schema/FarcasterUser.ts'
import { Source } from '$/sources/Source.ts'

export enum FarcasterUser_TimestampSelector {
	FarcasterUserTimestampMs = 'farcasterUserTimestampMs',
}

export default {
	entityType: EntityType.FarcasterUser_Timestamp,

	label: 'Farcaster user snapshot',
	labelPlural: 'Farcaster user snapshots',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterUser,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'followerCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
			],
		},
		{
			name: 'followingCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
