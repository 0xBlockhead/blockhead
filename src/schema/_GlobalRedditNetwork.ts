// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum _GlobalRedditNetworkSelector {
	Scope = 'Scope',
}
export default {
	entityType: EntityType._GlobalRedditNetwork,
	label: 'Reddit',
	labelPlural: 'Reddit',
	selectors: [
		{
			name: _GlobalRedditNetworkSelector.Scope,
			fields: [
				'scope',
			],
		},
	],
	fields: [
		{
			name: 'scope',
			label: 'Scope',
			description: 'The fixed scope value that identifies this global hub row.',
			type: EntityFieldType.Primitive,
			primitiveType: type.unit('_GlobalRedditNetwork'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$sourceWindowSubreddits',
			label: 'Subreddits',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RedditSubreddit,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.Reddit_PublicJson,
			],
		},
		{
			name: '$$sourceWindowLinks',
			label: 'Popular submissions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RedditLink,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.Reddit_PublicJson,
			],
		},
		{
			name: '$$timestamps',
			label: 'Observations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType._GlobalRedditNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
