// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum _GlobalFarcasterNetworkSelector {
	Scope = 'Scope',
}
export const _GlobalFarcasterNetwork = entity({
	entityType: EntityType._GlobalFarcasterNetwork,
	labels: {
		singular: 'global Farcaster network',
		plural: 'global Farcaster networks',
	},
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$observedUsers: {
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
	$$observedChannels: {
		label: 'observed channels',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.FarcasterChannel,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Farcaster_Rest,
			Source.Neynar_Rest,
		],
	},
	$$observedCasts: {
		label: 'observed casts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.FarcasterCast,
		cardinality: EntityFieldCardinality.Many,
	},
	$$observedFeeds: {
		label: 'observed feeds',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.FarcasterFeed,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.Farcaster_Rest,
		],
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType._GlobalFarcasterNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})
