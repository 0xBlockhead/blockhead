import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import FarcasterCast from '$/schema/FarcasterCast.ts'
import { Source } from '$/sources/Source.ts'

export enum FarcasterCast_TimestampSelector {
	FarcasterCastTimestampMs = 'farcasterCastTimestampMs',
}

export default {
	entityType: EntityType.FarcasterCast_Timestamp,

	label: 'Farcaster cast snapshot',
	labelPlural: 'Farcaster cast snapshots',

	selectors: [
		{
			name: FarcasterCast_TimestampSelector.FarcasterCastTimestampMs,
			fields: [
				'$cast',
				'timestampMs',
			],
		},
	],

	fields: [
		{
			name: '$cast',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterCast,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'likeCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
			],
		},
		{
			name: 'recastCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
			],
		},
		{
			name: 'replyCount',
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
