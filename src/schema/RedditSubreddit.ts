// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum RedditSubredditSelector {
	Name = 'Name',
}
export const RedditSubreddit = entity({
	entityType: EntityType.RedditSubreddit,
	labels: {
		singular: 'Reddit subreddit',
		plural: 'Reddit subreddits',
	},
})({
	name: {
		label: 'Name',
		description: 'The human-readable subreddit name.',
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
	publicDescription: {
		label: 'Public description',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		description: 'The time when the subreddit was created according to Reddit.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	over18: {
		label: 'Over 18',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		label: 'Icon',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.RedditSubreddit_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Reddit_PublicJson,
		],
	},
	$$links: {
		label: 'Submissions',
		type: EntityFieldType.EntitiesReference,
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
