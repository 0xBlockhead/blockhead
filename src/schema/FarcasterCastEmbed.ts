// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

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
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
	$embeddedCast: {
		entityType: EntityType.FarcasterCast,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
	title: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
	description: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
	iconUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
	$icon: {
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
	quotedPreviewText: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
})({
	selectors: {
		CastIndexInCast: [
			'$cast',
			'indexInCast',
		],
	},
})
