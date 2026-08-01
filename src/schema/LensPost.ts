// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$author: {
		entityType: EntityType.LensAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	text: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestamp: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isEdited: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isDeleted: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contentUri: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadataHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$commentOn: {
		entityType: EntityType.LensPost,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$quoteOf: {
		entityType: EntityType.LensPost,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$repostOf: {
		entityType: EntityType.LensPost,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$root: {
		entityType: EntityType.LensPost,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$comments: {
		entityType: EntityType.LensPost,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
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
