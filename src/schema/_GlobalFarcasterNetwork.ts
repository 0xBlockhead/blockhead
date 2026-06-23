import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum _GlobalFarcasterNetworkSelector {
	Scope = 'scope',
}
export default {
	entityType: EntityType._GlobalFarcasterNetwork,
	label: 'global Farcaster network',
	labelPlural: 'global Farcaster networks',
	selectors: [
		{
			name: _GlobalFarcasterNetworkSelector.Scope,
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
			primitiveType: type("'_GlobalFarcasterNetwork'"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$sourceWindowUsers',
			label: 'source window users',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterUser,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$sourceWindowChannels',
			label: 'source window channels',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterChannel,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$sourceWindowCasts',
			label: 'source window casts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterCast,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$sourceWindowFeeds',
			label: 'source window feeds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterFeed,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType._GlobalFarcasterNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
