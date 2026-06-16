import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum AtprotoPostSelector {
	Uri = 'uri',
}


const AtUri = type(
	'/^at:\\/\\/[^\\/]+\\/app\\.bsky\\.feed\\.post\\/[^\\/]+$/' as type.cast<string>
)

export default {
	entityType: EntityType.AtprotoPost,

	label: 'AT Protocol post',
	labelPlural: 'AT Protocol posts',

	selectors: [
		{
			name: AtprotoPostSelector.Uri,
			fields: [
				'uri',
			],
		},
	],

	fields: [
		{
			name: 'uri',
			type: EntityFieldType.Primitive,
			primitiveType: AtUri,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$author',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AtprotoActor,
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
			name: 'indexedAt',
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
			name: 'repostCount',
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
			entityType: EntityType.AtprotoPost_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'langs',
			type: EntityFieldType.Primitive,
			primitiveType: type('string[]'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'selfLabelValues',
			type: EntityFieldType.Primitive,
			primitiveType: type('string[]'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$parent',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AtprotoPost,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$root',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AtprotoPost,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$thread',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AtprotoPost,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
