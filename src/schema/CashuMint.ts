import { type } from 'arktype'

import { UrlString } from '$/schema/UrlString.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum CashuMintSelector {
	MintUrl = 'mintUrl',
}

export default {
	entityType: EntityType.CashuMint,

	label: 'Cashu mint',
	labelPlural: 'Cashu mints',

	selectors: [
		{
			name: CashuMintSelector.MintUrl,
			fields: [
				'mintUrl',
			],
		},
	],

	fields: [
		{
			name: 'mintUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
		{
			name: 'pubkey',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
		{
			name: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
		{
			name: 'description',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
		{
			name: 'motd',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
		{
			name: 'iconUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
		{
			name: 'tosUrl',
			type: EntityFieldType.Primitive,
			primitiveType: UrlString,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
		{
			name: 'timeMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
		{
			name: '$$keysets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CashuKeyset,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition
