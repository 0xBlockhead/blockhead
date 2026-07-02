// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum LensPostSelector {
	Id = 'Id',
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
				label: 'ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$author',
				label: 'Author',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.LensAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'text',
				label: 'Text',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'timestamp',
				label: 'Timestamp',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'isEdited',
				label: 'Edited',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'isDeleted',
				label: 'Deleted',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'contentUri',
				label: 'Content URI',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'metadataHash',
				label: 'Metadata hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$commentOn',
				label: 'Comment on',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.LensPost,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$quoteOf',
				label: 'Quote of',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.LensPost,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$repostOf',
				label: 'Repost of',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.LensPost,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$root',
				label: 'Root',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.LensPost,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$comments',
				label: 'Comments',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.LensPost,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$timestamps',
				label: 'Observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.LensPost_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
