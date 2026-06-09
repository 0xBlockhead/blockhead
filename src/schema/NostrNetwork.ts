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
	entityType: EntityType.NostrNetwork,

	label: 'Nostr network',
	labelPlural: 'Nostr networks',

	id: type({
		scope: type.unit('NostrNetwork'),
	}),

	fields: [
		{
			name: 'protocolName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'homeUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'docsUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'registryLabel',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: 'topology',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Constants_Internal,
			],
		},
		{
			name: '$$nostrProfiles',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NostrProfile,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
				Source.Primal_Rest,
			],
		},
		{
			name: '$$nostrNotes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NostrNote,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.NostrBand_Rest,
			],
		},
		{
			name: '$$nostrRelays',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NostrRelay,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		},
		{
			name: '$$nostrReposts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NostrRepost,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.NostrBand_Rest,
			],
		},
		{
			name: '$$nostrArticles',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.NostrArticle,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.NostrBand_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
