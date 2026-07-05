// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum CashuKeysetSelector {
	CashuMintKeysetId = 'CashuMintKeysetId',
}
export default {
	entityType: EntityType.CashuKeyset,
	label: 'Cashu keyset',
	labelPlural: 'Cashu keysets',
	selectors: [
		{
			name: CashuKeysetSelector.CashuMintKeysetId,
			fields: [
				'$mint',
				'keysetId',
			],
		},
	],
	fields: [
		{
				name: '$mint',
				label: 'mint',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.CashuMint,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'keysetId',
				label: 'keyset ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'unit',
				label: 'unit',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.CashuMint_Rest,
				],
		},
		{
				name: 'active',
				label: 'active',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.CashuMint_Rest,
				],
		},
		{
				name: 'inputFeePpk',
				label: 'input fee ppk',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.CashuMint_Rest,
				],
		},
		{
				name: 'keysByAmountJson',
				label: 'keys by amount JSON',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.CashuMint_Rest,
				],
		},
	],
} as const satisfies EntityDefinition
