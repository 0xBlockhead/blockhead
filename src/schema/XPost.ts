import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'

const XId = type(
	'/^\\d+$/' as type.cast<string>,
)

export default {
	entityType: EntityType.XPost,

	label: 'X post',
	labelPlural: 'X posts',

	id: type({
		id: XId,
	}),

	fields: [
		{
			name: '$author',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.XUser,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'text',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'likeCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'retweetCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'replyCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'quoteCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.XPost_Timestamp,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.X_Rest,
				Source.X_FxEmbed_Rest,
			],
		},
		{
			name: 'conversationId',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$replyToPost',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.XPost,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$quotedPost',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.XPost,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'postUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$media',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.X_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
