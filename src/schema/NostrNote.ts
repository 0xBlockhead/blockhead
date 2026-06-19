import { type } from 'arktype'
import { lowercaseHexIdentityValue } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum NostrNoteSelector {
	CanonicalEventId = 'canonicalEventId',
}


const NostrEventId = type(
	'/^[0-9a-f]{64}$/' as type.cast<string>
)

const NostrPubkey = type(
	'/^[0-9a-f]{64}$/' as type.cast<string>
)

export default {
	entityType: EntityType.NostrNote,

	label: 'Nostr note',
	labelPlural: 'Nostr notes',

	selectors: [
		{
			name: NostrNoteSelector.CanonicalEventId,
			fields: [
				'eventId',
			],
		},
	],

	fields: [
		{
			name: 'eventId',
			type: EntityFieldType.Primitive,
			primitiveType: NostrEventId,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'pubkey',
			type: EntityFieldType.Primitive,
			primitiveType: NostrPubkey,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'content',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'createdAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'tags',
			type: EntityFieldType.Primitive,
			primitiveType: type('string[][]'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$author',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NostrProfile,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'replyToEventId',
			type: EntityFieldType.Primitive,
			primitiveType: NostrEventId,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'rootEventId',
			type: EntityFieldType.Primitive,
			primitiveType: NostrEventId,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$replyToNote',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NostrNote,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$replies',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NostrNote,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$reactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NostrReaction,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
