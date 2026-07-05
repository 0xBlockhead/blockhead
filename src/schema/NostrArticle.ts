// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum NostrArticleSelector {
	CanonicalCoordinate = 'CanonicalCoordinate',
}
export default {
	entityType: EntityType.NostrArticle,
	label: 'Nostr article',
	labelPlural: 'Nostr articles',
	description: 'A Nostr long-form article is a replaceable kind-30023 event addressed by author public key and identifier.',
	selectors: [
		{
			name: NostrArticleSelector.CanonicalCoordinate,
			fields: [
				'kind',
				'pubkey',
				'identifier',
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
				name: 'identifier',
				label: 'Identifier',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'kind',
				label: 'Kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'title',
				label: 'Title',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'summary',
				label: 'Summary',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'imageUrl',
				label: 'Image URL',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NostrBand_Rest,
				],
		},
		{
				name: 'content',
				label: 'Content',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NostrBand_Rest,
				],
		},
		{
				name: 'publishedAt',
				label: 'Published',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NostrBand_Rest,
				],
		},
		{
				name: 'tags',
				label: 'Tags',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$author',
				label: 'Author',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.NostrProfile,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.NostrBand_Rest,
				],
		},
	],
} as const satisfies EntityDefinition
