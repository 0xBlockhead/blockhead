// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum _GlobalRedditNetworkSelector {
	Scope = 'Scope',
}
export const _GlobalRedditNetwork = entity({
	entityType: EntityType._GlobalRedditNetwork,
	label: 'Reddit',
	labelPlural: 'Reddit',
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this global hub row.',
		type: EntityFieldType.Primitive,
		primitiveType: type.unit('_GlobalRedditNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedSubreddits: {
		label: 'Subreddits',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.RedditSubreddit,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.Reddit_PublicJson,
		],
	},
	$$observedLinks: {
		label: 'Popular submissions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.RedditLink,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.Reddit_PublicJson,
		],
	},
	$$timestamps: {
		label: 'Observations',
		type: EntityFieldType.EntitiesReference,
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
