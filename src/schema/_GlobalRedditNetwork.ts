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
		primitiveType: type.unit('_GlobalRedditNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedSubreddits: {
		entityType: EntityType.RedditSubreddit,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Reddit_PublicJson,
			Source.Reddit_Rest,
		],
	},
	$$observedLinks: {
		entityType: EntityType.RedditLink,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Reddit_PublicJson,
			Source.Reddit_Rest,
		],
	},
	$$timestamps: {
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
