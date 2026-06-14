import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import FarcasterChannel from '$/schema/FarcasterChannel.ts'
import { Source } from '$/sources/Source.ts'

export enum FarcasterChannel_TimestampSelector {
	FarcasterChannelTimestampMs = 'farcasterChannelTimestampMs',
}

export default {
	entityType: EntityType.FarcasterChannel_Timestamp,

	label: 'Farcaster channel snapshot',
	labelPlural: 'Farcaster channel snapshots',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterChannel,
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
				Source.Farcaster_Rest,
			],
		},
		{
			name: 'memberCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Farcaster_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
