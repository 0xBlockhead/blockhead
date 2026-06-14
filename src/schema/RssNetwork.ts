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

export enum RssNetworkSelector {
	Scope = 'scope',
}

export default {
	entityType: EntityType.RssNetwork,

	label: 'RSS network',
	labelPlural: 'RSS networks',

	selectors: [
		{
			name: RssNetworkSelector.Scope,
			fields: [
				'scope',
			],
		},
	],

	fields: [
		{
			name: 'scope',
			type: EntityFieldType.Primitive,
			primitiveType: type.unit('RssNetwork'),
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
			name: '$$rssFeeds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RssFeed,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$rssItems',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RssItem,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Rss_Rest,
				Source.Rss2Json_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
