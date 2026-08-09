// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.FarcasterFeed,
	labels: {
		singular: 'Farcaster feed',
		plural: 'Farcaster feeds',
	},
})({
	variant: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fid: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	channelId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	viewerFid: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	label: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$entries: {
		entityType: EntityType.FarcasterCast,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Neynar_Rest,
			Source.Snapchain_Rest,
		],
	},
})({
	selectors: {
		Variant: [
			'variant',
		],
		ByUser: [
			'variant',
			'fid',
		],
		ByChannel: [
			'variant',
			'channelId',
		],
		Following: [
			'variant',
			'viewerFid',
		],
	},
})
