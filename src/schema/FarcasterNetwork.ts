// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum FarcasterNetworkSelector {
	Scope = 'Scope',
}
export default {
	entityType: EntityType.FarcasterNetwork,
	label: 'Farcaster',
	labelPlural: 'Farcaster',
	description: 'Farcaster profiles, channels, and casts: FID plus cast-hash identity with hub feeds from configured Farcaster sources.',
	selectors: [
		{
			name: FarcasterNetworkSelector.Scope,
			fields: [
				'scope',
			],
		},
	],
	fields: [
		{
				name: 'scope',
				label: 'Scope',
				description: 'The fixed scope value that identifies this hub row.',
				type: EntityFieldType.Primitive,
				primitiveType: type.unit('FarcasterNetwork'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'protocolName',
				label: 'Protocol',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'homeUrl',
				label: 'Home URL',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'docsUrl',
				label: 'Docs URL',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'registryLabel',
				label: 'Registry',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'topology',
				label: 'Topology',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$feeds',
				label: 'Feeds',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.FarcasterFeed,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
					Source.Farcaster_Rest,
				],
		},
		{
				name: '$$users',
				label: 'Users',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.FarcasterUser,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$channels',
				label: 'Channels',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.FarcasterChannel,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
