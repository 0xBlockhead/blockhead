// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum _GlobalNostrNetworkSelector {
	Scope = 'Scope',
}
export default {
	entityType: EntityType._GlobalNostrNetwork,
	label: 'Nostr',
	labelPlural: 'Nostr',
	description: 'Nostr is a relay-based social protocol for signed events. Profiles, notes, reposts, and articles are event kinds; relays are transport endpoints and are not global proof that an event exists everywhere.',
	selectors: [
		{
			name: _GlobalNostrNetworkSelector.Scope,
			fields: [
				'scope',
			],
		},
	],
	fields: [
		{
				name: 'scope',
				label: 'Scope',
				description: 'The fixed scope value that identifies this global hub row.',
				type: EntityFieldType.Primitive,
				primitiveType: type.unit('_GlobalNostrNetwork'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'protocolName',
				label: 'Protocol',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
		},
		{
				name: 'registryLabel',
				label: 'Registry',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
		},
		{
				name: 'homeUrl',
				label: 'Home',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
		},
		{
				name: 'docsUrl',
				label: 'Docs',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
		},
		{
				name: 'topology',
				label: 'Topology',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
				],
		},
		{
				name: '$$sourceWindowProfiles',
				label: 'Profiles',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.NostrProfile,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
		},
		{
				name: '$$sourceWindowNotes',
				label: 'Notes',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.NostrNote,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
		},
		{
				name: '$$sourceWindowRelays',
				label: 'Relays',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.NostrRelay,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
		},
		{
				name: '$$sourceWindowReposts',
				label: 'Reposts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.NostrRepost,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
		},
		{
				name: '$$sourceWindowReactions',
				label: 'Reactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.NostrReaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
		},
		{
				name: '$$sourceWindowArticles',
				label: 'Articles',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.NostrArticle,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
		},
	],
} as const satisfies EntityDefinition
