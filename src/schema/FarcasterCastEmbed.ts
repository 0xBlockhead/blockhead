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
		label: 'Cast',
		entityType: EntityType.FarcasterCast,
		cardinality: EntityFieldCardinality.One,
	},
	indexInCast: {
		label: 'Index in cast',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	url: {
		label: 'URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
	$embeddedCast: {
		label: 'Embedded cast',
		entityType: EntityType.FarcasterCast,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
	title: {
		label: 'Title',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
	description: {
		label: 'Description',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
	iconUrl: {
		label: 'Icon URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
	$icon: {
		label: 'Icon',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
	quotedPreviewText: {
		label: 'Quoted preview text',
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
