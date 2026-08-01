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
		label: 'Fullname',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	body: {
		label: 'Body',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	author: {
		label: 'Author',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the comment was created according to Reddit.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	depth: {
		label: 'Depth',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$link: {
		label: 'Submission',
		entityType: EntityType.RedditLink,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$parentComment: {
		label: 'Parent comment',
		entityType: EntityType.RedditComment,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.RedditComment_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Reddit_PublicJson,
		],
	},
	$$replies: {
		label: 'Replies',
		entityType: EntityType.RedditComment,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Reddit_PublicJson,
		],
	},
})({
	selectors: {
		Fullname: [
			'fullname',
		],
	},
})
