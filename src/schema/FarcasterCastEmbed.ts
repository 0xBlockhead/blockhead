// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FarcasterCast,
		cardinality: EntityFieldCardinality.One,
	},
	indexInCast: {
		label: 'Index in cast',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	url: {
		label: 'URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
	$embeddedCast: {
		label: 'Embedded cast',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.FarcasterCast,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
	title: {
		label: 'Title',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
	description: {
		label: 'Description',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
	iconUrl: {
		label: 'Icon URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
	$icon: {
		label: 'Icon',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Snapchain_Rest,
		],
	},
	quotedPreviewText: {
		label: 'Quoted preview text',
		type: EntityFieldType.Primitive,
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
