import { type } from 'arktype'
import { lowercaseHexIdentityValue } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'

export enum NostrArticleSelector {
	CanonicalCoordinate = 'canonicalCoordinate',
}


const NostrPubkey = type(
	'/^[0-9a-f]{64}$/' as type.cast<string>
)

export default {
	entityType: EntityType.NostrArticle,

	label: 'Nostr article',
	labelPlural: 'Nostr articles',

	selectors: [
		{
			name: NostrArticleSelector.CanonicalCoordinate,
			fields: [
				'pubkey',
				'identifier',
			],
		},
	],

	fields: [
		{
			name: 'pubkey',
			type: EntityFieldType.Primitive,
			primitiveType: NostrPubkey,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'identifier',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'title',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'summary',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'imageUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'content',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'publishedAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tags',
			type: EntityFieldType.Primitive,
			primitiveType: type('string[][]'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$author',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NostrProfile,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
