// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AtprotoPost_TimestampSelector {
	AtprotoPostTimestampMs = 'AtprotoPostTimestampMs',
}
export const AtprotoPost_Timestamp = entity({
	entityType: EntityType.AtprotoPost_Timestamp,
	labels: {
		singular: 'AT Protocol post observation',
		plural: 'AT Protocol post observations',
	},
})({
	$post: {
		label: 'Post',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AtprotoPost,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	likeCount: {
		label: 'Likes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	repostCount: {
		label: 'Reposts',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	replyCount: {
		label: 'Replies',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	quoteCount: {
		label: 'Quotes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AtprotoPostTimestampMs: [
			'$post',
			'timestampMs',
		],
	},
})
