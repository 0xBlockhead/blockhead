// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum _GlobalRssNetworkSelector {
	Scope = 'Scope',
}
export default {
	entityType: EntityType._GlobalRssNetwork,
	label: 'global RSS network',
	labelPlural: 'global RSS networks',
	selectors: [
		{
			name: _GlobalRssNetworkSelector.Scope,
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
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$observedFeeds',
			label: 'observed feeds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RssFeed,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$observedItems',
			label: 'observed items',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RssItem,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType._GlobalRssNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
