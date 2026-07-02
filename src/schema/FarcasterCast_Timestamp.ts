// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum FarcasterCast_TimestampSelector {
	FarcasterCastTimestampMs = 'FarcasterCastTimestampMs',
}
export default {
	entityType: EntityType.FarcasterCast_Timestamp,
	label: 'Farcaster cast observation',
	labelPlural: 'Farcaster cast observations',
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
				label: 'Cast',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.FarcasterCast,
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
				name: 'likeCount',
				label: 'Likes',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'recastCount',
				label: 'Recasts',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'replyCount',
				label: 'Replies',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
