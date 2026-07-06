// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum _GlobalFarcasterNetworkSelector {
	Scope = 'Scope',
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
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$observedUsers',
			label: 'observed users',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterUser,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Farcaster_Rest,
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
			],
		},
		{
			name: '$$observedChannels',
			label: 'observed channels',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterChannel,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Farcaster_Rest,
				Source.Neynar_Rest,
			],
		},
		{
			name: '$$observedCasts',
			label: 'observed casts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterCast,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$observedFeeds',
			label: 'observed feeds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterFeed,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.Farcaster_Rest,
			],
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
