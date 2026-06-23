import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum FarcasterChannel_TimestampSelector {
	FarcasterChannelTimestampMs = 'farcasterChannelTimestampMs',
	ChannelTimestampMs = '$channel+timestampMs',
}
export default {
	entityType: EntityType.FarcasterChannel_Timestamp,
	label: 'Farcaster channel timestamp',
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
			label: 'channel',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterChannel,
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
			name: 'memberCount',
			label: 'member count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
