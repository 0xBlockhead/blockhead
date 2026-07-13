// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum XPostSelector {
	Id = 'Id',
}
export const XPost = entity({
	entityType: EntityType.XPost,
	labels: {
		singular: 'X post',
		plural: 'X posts',
	},
})({
	id: {
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$author: {
		label: 'Author',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.XUser,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	text: {
		label: 'Text',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	conversationId: {
		label: 'Conversation ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$replyToPost: {
		label: 'Reply to post',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.XPost,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$quotedPost: {
		label: 'Quoted post',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.XPost,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	postUrl: {
		label: 'Post URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$media: {
		label: 'Media',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.XPost_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Id: [
			'id',
		],
	},
})
