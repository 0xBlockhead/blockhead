// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum LitecoinMwebPegInSelector {
	LitecoinMwebTransactionPegInIndex = 'LitecoinMwebTransactionPegInIndex',
}
export const LitecoinMwebPegIn = entity({
	entityType: EntityType.LitecoinMwebPegIn,
	labels: {
		singular: 'litecoin MWEB peg in',
		plural: 'litecoin MWEB peg ins',
	},
})({
	$transaction: {
		label: 'transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.LitecoinMwebTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	pegInIndex: {
		label: 'peg in index',
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
		LitecoinMwebTransactionPegInIndex: [
			'$transaction',
			'pegInIndex',
		],
	},
})
