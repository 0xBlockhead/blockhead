// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RedditComment,
	labels: {
		singular: 'Reddit comment',
		plural: 'Reddit comments',
	},
})({
	fullname: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	body: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	author: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	depth: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$link: {
		entityType: EntityType.RedditLink,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$parentComment: {
		entityType: EntityType.RedditComment,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.RedditComment_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Reddit_PublicJson,
			Source.Reddit_Rest,
		],
	},
	$$replies: {
		entityType: EntityType.RedditComment,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Reddit_PublicJson,
			Source.Reddit_Rest,
		],
	},
})({
	selectors: {
		Fullname: [
			'fullname',
		],
	},
})
