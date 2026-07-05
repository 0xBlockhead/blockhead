// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum LitecoinMwebPegOutSelector {
	LitecoinMwebTransactionPegOutIndex = 'LitecoinMwebTransactionPegOutIndex',
}
export default {
	entityType: EntityType.LitecoinMwebPegOut,
	label: 'litecoin MWEB peg out',
	labelPlural: 'litecoin MWEB peg outs',
	selectors: [
		{
			name: LitecoinMwebPegOutSelector.LitecoinMwebTransactionPegOutIndex,
			fields: [
				'$transaction',
				'pegOutIndex',
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
				name: 'pegOutIndex',
				label: 'peg out index',
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
