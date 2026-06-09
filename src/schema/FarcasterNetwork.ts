import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.FarcasterNetwork,

	label: 'Farcaster Network',
	labelPlural: 'Farcaster Networks',

	id: type({
		scope: type.unit('FarcasterNetwork'),
	}),

	fields: [
		{
			name: 'protocolName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Farcaster_Rest,
			],
		},
		{
			name: 'homeUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Farcaster_Rest,
			],
		},
		{
			name: 'docsUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Farcaster_Rest,
			],
		},
		{
			name: 'registryLabel',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Farcaster_Rest,
			],
		},
		{
			name: 'topology',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Farcaster_Rest,
			],
		},
		{
			name: '$$feeds',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterFeed,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$users',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterUser,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$channels',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.FarcasterChannel,
			cardinality: EntityFieldCardinality.Many,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
