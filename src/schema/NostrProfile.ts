// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NostrProfileSelector {
	CanonicalPubkey = 'CanonicalPubkey',
}
export default {
	entityType: EntityType.NostrProfile,
	label: 'Nostr profile',
	labelPlural: 'Nostr profiles',
	description: 'A Nostr profile is replaceable kind-0 metadata keyed by a 64-character lowercase hex public key.',
	selectors: [
		{
			name: NostrProfileSelector.CanonicalPubkey,
			fields: [
				'pubkey',
			],
		},
	],
	fields: [
		{
				name: 'pubkey',
				label: 'Pubkey',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'displayName',
				label: 'Display name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
		},
		{
				name: 'about',
				label: 'About',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
		},
		{
				name: 'nip05',
				label: 'NIP-05',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
		},
		{
				name: 'lud16',
				label: 'Lightning address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NostrBand_Rest,
				],
		},
		{
				name: 'lud06',
				label: 'Lightning invoice',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NostrBand_Rest,
				],
		},
		{
				name: 'website',
				label: 'Website',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
		},
		{
				name: 'metadataUpdatedAt',
				label: 'Metadata updated',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
		},
		{
				name: 'iconUrl',
				label: 'Icon URL',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$icon',
				label: 'Icon',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Media,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NostrBand_Rest,
				],
		},
		{
				name: 'bannerUrl',
				label: 'Banner URL',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$banner',
				label: 'Banner',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Media,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NostrBand_Rest,
				],
		},
		{
				name: '$$notes',
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
				name: '$$articles',
				label: 'Articles',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.NostrArticle,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
		},
		{
				name: '$$reposts',
				label: 'Reposts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.NostrRepost,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
		},
	],
} as const satisfies EntityDefinition
