import { type } from 'arktype'
import FarcasterCast from '$/schema/FarcasterCast.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'

export enum FarcasterCastEmbedSelector {
	FarcasterCastIndex = 'farcasterCastIndex',
}

export default {
	entityType: EntityType.FarcasterCastEmbed,

	label: 'Farcaster Cast Embed',
	labelPlural: 'Farcaster Cast Embeds',

	selectors: [
		{
			name: FarcasterCastEmbedSelector.FarcasterCastIndex,
			fields: [
				'$cast',
				'index',
			],
		},
	],

	fields: [
		{
			name: '$cast',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterCast,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'url',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$embeddedCast',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.FarcasterCast,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'title',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'description',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
			],
		},
		{
			name: 'quotedPreviewText',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
