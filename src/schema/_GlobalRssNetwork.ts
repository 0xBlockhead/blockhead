import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum _GlobalRssNetworkSelector {
	Scope = 'scope',
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
			primitiveType: type("'_GlobalRssNetwork'"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$sourceWindowFeeds',
			label: 'source window feeds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.RssFeed,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$sourceWindowItems',
			label: 'source window items',
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
