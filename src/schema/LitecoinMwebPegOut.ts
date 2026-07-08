// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum LitecoinMwebPegOutSelector {
	LitecoinMwebTransactionPegOutIndex = 'LitecoinMwebTransactionPegOutIndex',
}
export const LitecoinMwebPegOut = entity({
	entityType: EntityType.LitecoinMwebPegOut,
	label: 'litecoin MWEB peg out',
	labelPlural: 'litecoin MWEB peg outs',
})({
	$transaction: {
		label: 'transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LitecoinMwebTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	pegOutIndex: {
		label: 'peg out index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$transparentOutput: {
		label: 'transparent output',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountLitoshis: {
		label: 'amount litoshis',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		LitecoinMwebTransactionPegOutIndex: [
			'$transaction',
			'pegOutIndex',
		],
	},
})
