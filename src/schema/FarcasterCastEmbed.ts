// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FarcasterCastEmbedSelector {
	CastIndexInCast = 'CastIndexInCast',
}
export const FarcasterCastEmbed = entity({
	entityType: EntityType.FarcasterCastEmbed,
	label: 'Farcaster cast embed',
	labelPlural: 'Farcaster cast embeds',
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
		primitiveType: type('number'),
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
