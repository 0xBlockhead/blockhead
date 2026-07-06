// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum CashuMintSelector {
	MintUrl = 'MintUrl',
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
			label: 'mint URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
		{
			name: 'pubkey',
			label: 'public key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
		{
			name: 'version',
			label: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
		{
			name: 'description',
			label: 'Description',
			description: 'A human-readable description from the source domain.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
		{
			name: 'motd',
			label: 'motd',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
		{
			name: 'iconUrl',
			label: 'icon URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
		{
			name: 'tosUrl',
			label: 'tos URL',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
		{
			name: 'timeMs',
			label: 'time ms',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
		{
			name: '$$keysets',
			label: 'keysets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CashuKeyset,
			cardinality: EntityFieldCardinality.Many,
			defaultSources: [
				Source.CashuMint_Rest,
			],
		},
	],
} as const satisfies EntityDefinition
