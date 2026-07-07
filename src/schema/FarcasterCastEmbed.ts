// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FarcasterCastEmbedSelector {
	CastIndexInCast = 'CastIndexInCast',
}
export default {
	entityType: EntityType.FarcasterCastEmbed,
	label: 'Farcaster cast embed',
	labelPlural: 'Farcaster cast embeds',
	selectors: [
		{
			name: FarcasterCastEmbedSelector.CastIndexInCast,
			fields: [
				'$cast',
				'indexInCast',
			],
		},
	],
	fields: [
		{
			name: '$cast',
			label: 'Cast',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterCast,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'indexInCast',
			label: 'Index in cast',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'url',
			label: 'URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Snapchain_Rest,
			],
		},
		{
			name: '$embeddedCast',
			label: 'Embedded cast',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterCast,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Snapchain_Rest,
			],
		},
		{
			name: 'title',
			label: 'Title',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Snapchain_Rest,
			],
		},
		{
			name: 'description',
			label: 'Description',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Snapchain_Rest,
			],
		},
		{
			name: 'iconUrl',
			label: 'Icon URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Snapchain_Rest,
			],
		},
		{
			name: '$icon',
			label: 'Icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Snapchain_Rest,
			],
		},
		{
			name: 'quotedPreviewText',
			label: 'Quoted preview text',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Snapchain_Rest,
			],
		},
	],
} as const satisfies EntityDefinition
