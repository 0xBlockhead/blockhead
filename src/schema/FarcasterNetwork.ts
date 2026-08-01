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
		primitiveType: type.unit('FarcasterNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	homeUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	docsUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registryName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	relationshipModel: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$feeds: {
		entityType: EntityType.FarcasterFeed,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Constants_Internal,
			Source.Farcaster_Rest,
		],
	},
	$$users: {
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
	$$channels: {
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
