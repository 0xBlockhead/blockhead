// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LensPost,
	labels: {
		singular: 'Lens post',
		plural: 'Lens posts',
	},
})({
	id: {
		label: 'ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$author: {
		label: 'Author',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LensAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	text: {
		label: 'Text',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestamp: {
		label: 'Timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isEdited: {
		label: 'Edited',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isDeleted: {
		label: 'Deleted',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contentUri: {
		label: 'Content URI',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadataHash: {
		label: 'Metadata hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$commentOn: {
		label: 'Comment on',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LensPost,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$quoteOf: {
		label: 'Quote of',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LensPost,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$repostOf: {
		label: 'Repost of',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LensPost,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$root: {
		label: 'Root',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LensPost,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$comments: {
		label: 'Comments',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LensPost,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.LensPost_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
