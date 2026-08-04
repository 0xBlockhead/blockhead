// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FarcasterChannel,
	labels: {
		singular: 'Farcaster channel',
		plural: 'Farcaster channels',
	},
})({
	id: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	parentUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$lead: {
		entityType: EntityType.FarcasterUser,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$casts: {
		entityType: EntityType.FarcasterCast,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Neynar_Rest,
			Source.Snapchain_Rest,
		],
	},
	$$timestamps: {
		entityType: EntityType.FarcasterChannel_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Farcaster_Rest,
			Source.Neynar_Rest,
		],
	},
})({
	selectors: {
		Id: [
			'id',
		],
		ParentUrl: [
			'parentUrl',
		],
	},
})
