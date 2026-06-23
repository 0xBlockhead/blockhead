import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum FarcasterUser_TimestampSelector {
	FarcasterUserTimestampMs = 'farcasterUserTimestampMs',
	UserTimestampMs = '$user+timestampMs',
}
export default {
	entityType: EntityType.FarcasterUser_Timestamp,
	label: 'Farcaster user timestamp',
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
			label: 'user',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterUser,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'followerCount',
			label: 'follower count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'followingCount',
			label: 'following count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
