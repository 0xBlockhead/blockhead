// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RedditSubreddit,
	labels: {
		singular: 'Reddit subreddit',
		plural: 'Reddit subreddits',
	},
})({
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	publicDescription: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	over18: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.RedditSubreddit_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Reddit_PublicJson,
		],
	},
	$$links: {
		entityType: EntityType.RedditLink,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Reddit_PublicJson,
		],
	},
})({
	selectors: {
		Name: [
			'name',
		],
	},
})
