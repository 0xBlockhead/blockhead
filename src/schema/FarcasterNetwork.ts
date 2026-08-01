// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FarcasterNetwork,
	labels: {
		singular: 'Farcaster',
		plural: 'Farcaster',
	},
	description: 'Farcaster profiles, channels, and casts: FID plus cast-hash identity with hub feeds from declared Farcaster sources.',
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		primitiveType: type.unit('FarcasterNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		label: 'Protocol',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	homeUrl: {
		label: 'Home URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	docsUrl: {
		label: 'Docs URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registryName: {
		label: 'Registry name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	relationshipModel: {
		label: 'Connection model',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$feeds: {
		label: 'Feeds',
		entityType: EntityType.FarcasterFeed,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.Farcaster_Rest,
		],
	},
	$$users: {
		label: 'Users',
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
	$$channels: {
		label: 'Channels',
		entityType: EntityType.FarcasterChannel,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Farcaster_Rest,
		],
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})
