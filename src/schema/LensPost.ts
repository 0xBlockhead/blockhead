import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum LensPostSelector {
	Id = 'id',
}

export default {
	entityType: EntityType.LensPost,

	label: 'Lens post',
	labelPlural: 'Lens posts',

	selectors: [
		{
			name: LensPostSelector.Id,
			fields: [
				'id',
			],
		},
	],

	fields: [
		{
			name: 'id',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$author',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LensAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'text',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'isEdited',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'isDeleted',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LensPost_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$commentOn',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LensPost,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$quoteOf',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LensPost,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$repostOf',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LensPost,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$root',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LensPost,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$comments',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.LensPost,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
