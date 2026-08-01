// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType._GlobalRedditNetwork,
	labels: {
		singular: 'Reddit',
		plural: 'Reddit',
	},
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this global hub row.',
		primitiveType: type.unit('_GlobalRedditNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedSubreddits: {
		label: 'Subreddits',
		entityType: EntityType.RedditSubreddit,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Reddit_PublicJson,
		],
	},
	$$observedLinks: {
		label: 'Popular submissions',
		entityType: EntityType.RedditLink,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Reddit_PublicJson,
		],
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType._GlobalRedditNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})
