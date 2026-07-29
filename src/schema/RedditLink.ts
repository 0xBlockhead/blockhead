// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	title: {
		label: 'Title',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	selftext: {
		label: 'Body',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	url: {
		label: 'URL',
		description: 'The URL for the linked resource.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	permalink: {
		label: 'Permalink',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	author: {
		label: 'Author',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the submission was created according to Reddit.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$subreddit: {
		label: 'Subreddit',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.RedditSubreddit,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.RedditLink_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Reddit_PublicJson,
		],
	},
	$$comments: {
		label: 'Comments',
		type: EntityFieldType.EntitiesReference,
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
