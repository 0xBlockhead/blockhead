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
		label: 'ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$author: {
		label: 'Author',
		entityType: EntityType.LensAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	text: {
		label: 'Text',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestamp: {
		label: 'Timestamp',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isEdited: {
		label: 'Edited',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isDeleted: {
		label: 'Deleted',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contentUri: {
		label: 'Content URI',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadataHash: {
		label: 'Metadata hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$commentOn: {
		label: 'Comment on',
		entityType: EntityType.LensPost,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$quoteOf: {
		label: 'Quote of',
		entityType: EntityType.LensPost,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$repostOf: {
		label: 'Repost of',
		entityType: EntityType.LensPost,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$root: {
		label: 'Root',
		entityType: EntityType.LensPost,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$comments: {
		label: 'Comments',
		entityType: EntityType.LensPost,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'Observations',
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
