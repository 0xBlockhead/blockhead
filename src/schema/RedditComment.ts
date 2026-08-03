// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const redditPublicJsonSources = [
	Source.Reddit_PublicJson,
] as const

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
		defaultSources: redditPublicJsonSources,
	},
	$$replies: {
		entityType: EntityType.RedditComment,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: redditPublicJsonSources,
	},
})({
	selectors: {
		Fullname: [
			'fullname',
		],
	},
})
