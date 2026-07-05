// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum LitecoinMwebPegInSelector {
	LitecoinMwebTransactionPegInIndex = 'LitecoinMwebTransactionPegInIndex',
}
export default {
	entityType: EntityType.LitecoinMwebPegIn,
	label: 'litecoin MWEB peg in',
	labelPlural: 'litecoin MWEB peg ins',
	selectors: [
		{
			name: LitecoinMwebPegInSelector.LitecoinMwebTransactionPegInIndex,
			fields: [
				'$transaction',
				'pegInIndex',
			],
		},
	],
	fields: [
		{
				name: '$transaction',
				label: 'transaction',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.LitecoinMwebTransaction,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'pegInIndex',
				label: 'peg in index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$transparentOutput',
				label: 'transparent output',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.UtxoOutput,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'amountLitoshis',
				label: 'amount litoshis',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
