// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum FarcasterChannel_TimestampSelector {
	FarcasterChannelTimestampMs = 'FarcasterChannelTimestampMs',
}
export default {
	entityType: EntityType.FarcasterChannel_Timestamp,
	label: 'Farcaster channel observation',
	labelPlural: 'Farcaster channel observations',
	selectors: [
		{
			name: FarcasterChannel_TimestampSelector.FarcasterChannelTimestampMs,
			fields: [
				'$channel',
				'timestampMs',
			],
		},
	],
	fields: [
		{
			name: '$channel',
			label: 'Channel',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterChannel,
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
			name: 'memberCount',
			label: 'Members',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
