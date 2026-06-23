import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum NostrArticleSelector {
	CanonicalCoordinate = 'canonicalCoordinate',
	KindPubkeyIdentifier = 'kind+pubkey+identifier',
}
export default {
	entityType: EntityType.NostrArticle,
	label: 'Nostr article',
	labelPlural: 'Nostr articles',
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
			label: 'public key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'identifier',
			label: 'identifier',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'kind',
			label: 'kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'title',
			label: 'title',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'summary',
			label: 'summary',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'imageUrl',
			label: 'image URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'content',
			label: 'content',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'publishedAt',
			label: 'published AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tags',
			label: 'tags',
			type: EntityFieldType.Primitive,
			primitiveType: type("string[][]"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$author',
			label: 'author',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NostrProfile,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
