// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LitecoinMwebPegOut,
	labels: {
		singular: 'litecoin MWEB peg out',
		plural: 'litecoin MWEB peg outs',
	},
})({
	$transaction: {
		entityType: EntityType.LitecoinMwebTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	pegOutIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$transparentOutput: {
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountLitoshis: {
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
