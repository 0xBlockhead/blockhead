import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import LensPost from '$/schema/LensPost.ts'
import { Source } from '$/sources/Source.ts'

export enum LensPost_TimestampSelector {
	LensPostTimestampMs = 'lensPostTimestampMs',
}

export default {
	entityType: EntityType.LensPost_Timestamp,

	label: 'Lens post snapshot',
	labelPlural: 'Lens post snapshots',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LensPost,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'commentCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lens_Graphql,
			],
		},
		{
			name: 'repostCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lens_Graphql,
			],
		},
		{
			name: 'quoteCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lens_Graphql,
			],
		},
		{
			name: 'bookmarkCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lens_Graphql,
			],
		},
		{
			name: 'collectCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lens_Graphql,
			],
		},
		{
			name: 'reactionCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Lens_Graphql,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
