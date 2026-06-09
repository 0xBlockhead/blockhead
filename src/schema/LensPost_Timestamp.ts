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

export default {
	entityType: EntityType.LensPost_Timestamp,

	label: 'Lens post snapshot',
	labelPlural: 'Lens post snapshots',

	id: type({
		$post: LensPost.id,
		timestampMs: 'number',
	}),

	fields: [
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
