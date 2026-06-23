import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum FarcasterCast_TimestampSelector {
	FarcasterCastTimestampMs = 'farcasterCastTimestampMs',
	CastTimestampMs = '$cast+timestampMs',
}
export default {
	entityType: EntityType.FarcasterCast_Timestamp,
	label: 'Farcaster cast timestamp',
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
			label: 'cast',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterCast,
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
			name: 'likeCount',
			label: 'like count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'recastCount',
			label: 'recast count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'replyCount',
			label: 'reply count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
