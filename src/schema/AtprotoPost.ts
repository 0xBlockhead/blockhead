import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AtprotoPostSelector {
	Uri = 'uri',
}
export default {
	entityType: EntityType.AtprotoPost,
	label: 'atproto post',
	labelPlural: 'atproto posts',
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
			label: 'URI',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$author',
			label: 'author',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AtprotoActor,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'text',
			label: 'text',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAt',
			label: 'Created',
			description: 'The time when the subject was created according to the source.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'indexedAt',
			label: 'indexed AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AtprotoPost_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'langs',
			label: 'langs',
			type: EntityFieldType.Primitive,
			primitiveType: type("string[]"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'selfLabelValues',
			label: 'self label values',
			type: EntityFieldType.Primitive,
			primitiveType: type("string[]"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$parent',
			label: 'parent',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AtprotoPost,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$root',
			label: 'root',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AtprotoPost,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$thread',
			label: 'thread',
			labelPlural: 'threadses',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AtprotoPost,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
