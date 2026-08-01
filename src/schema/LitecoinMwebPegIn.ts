// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LitecoinMwebPegIn,
	labels: {
		singular: 'litecoin MWEB peg in',
		plural: 'litecoin MWEB peg ins',
	},
})({
	$transaction: {
		label: 'transaction',
		entityType: EntityType.LitecoinMwebTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	pegInIndex: {
		label: 'peg in index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$transparentOutput: {
		label: 'transparent output',
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountLitoshis: {
		label: 'amount litoshis',
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
