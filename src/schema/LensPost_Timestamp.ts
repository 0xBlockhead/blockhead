// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum LensPost_TimestampSelector {
	LensPostTimestampMs = 'LensPostTimestampMs',
}
export default {
	entityType: EntityType.LensPost_Timestamp,
	label: 'Lens post observation',
	labelPlural: 'Lens post observations',
	selectors: [
		{
			name: LensPost_TimestampSelector.LensPostTimestampMs,
			fields: [
				'$post',
				'timestampMs',
			],
		},
	],
	fields: [
		{
				name: '$post',
				label: 'Post',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.LensPost,
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
				name: 'commentCount',
				label: 'Comments',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'repostCount',
				label: 'Reposts',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'quoteCount',
				label: 'Quotes',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'bookmarkCount',
				label: 'Bookmarks',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'collectCount',
				label: 'Collects',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'reactionCount',
				label: 'Reactions',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
