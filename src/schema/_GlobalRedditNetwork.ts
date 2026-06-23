import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum _GlobalRedditNetworkSelector {
	Scope = 'scope',
}
export default {
	entityType: EntityType._GlobalRedditNetwork,
	label: 'global Reddit network',
	labelPlural: 'global Reddit networks',
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
			description: 'The fixed scope value that identifies this hub row.',
			type: EntityFieldType.Primitive,
			primitiveType: type("'_GlobalRedditNetwork'"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$sourceWindowSubreddits',
			label: 'source window subreddits',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RedditSubreddit,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$sourceWindowLinks',
			label: 'source window links',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RedditLink,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType._GlobalRedditNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
