import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'

export enum RedditNetworkSelector {
	Scope = 'scope',
}

export default {
	entityType: EntityType.RedditNetwork,

	label: 'Reddit network',
	labelPlural: 'Reddit networks',

	selectors: [
		{
			name: RedditNetworkSelector.Scope,
			fields: [
				'scope',
			],
		},
	],

	fields: [
		{
			name: 'scope',
			type: EntityFieldType.Primitive,
			primitiveType: type.unit('RedditNetwork'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'protocolName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'homeUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'docsUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'registryLabel',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'topology',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$redditSubreddits',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RedditSubreddit,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.Reddit_Rest,
				Source.Reddit_PublicJson,
			],
		},
		{
			name: '$$redditLinks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RedditLink,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Reddit_Rest,
				Source.Reddit_PublicJson,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
