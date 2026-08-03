// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const snapchainRestSources = [
	Source.Snapchain_Rest,
] as const

export default entity({
	entityType: EntityType.FarcasterCastEmbed,
	labels: {
		singular: 'Farcaster cast embed',
		plural: 'Farcaster cast embeds',
	},
})({
	$cast: {
		entityType: EntityType.FarcasterCast,
		cardinality: EntityFieldCardinality.One,
	},
	indexInCast: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	url: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: snapchainRestSources,
	},
	$embeddedCast: {
		entityType: EntityType.FarcasterCast,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: snapchainRestSources,
	},
	title: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: snapchainRestSources,
	},
	description: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: snapchainRestSources,
	},
	iconUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: snapchainRestSources,
	},
	$icon: {
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: snapchainRestSources,
	},
	quotedPreviewText: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: snapchainRestSources,
	},
})({
	selectors: {
		CastIndexInCast: [
			'$cast',
			'indexInCast',
		],
	},
})
