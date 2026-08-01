// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RedditLink,
	labels: {
		singular: 'Reddit submission',
		plural: 'Reddit submissions',
	},
})({
	fullname: {
		label: 'Fullname',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		label: 'Title',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	selftext: {
		label: 'Body',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	url: {
		label: 'URL',
		description: 'The URL for the linked resource.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	permalink: {
		label: 'Permalink',
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
		description: 'The time when the submission was created according to Reddit.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$subreddit: {
		label: 'Subreddit',
		entityType: EntityType.RedditSubreddit,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.RedditLink_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Reddit_PublicJson,
		],
	},
	$$comments: {
		label: 'Comments',
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
