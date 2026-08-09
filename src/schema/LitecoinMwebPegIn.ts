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
		entityType: EntityType.LitecoinMwebTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	pegInIndex: {
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
		LitecoinMwebTransactionPegInIndex: [
			'$transaction',
			'pegInIndex',
		],
	},
})
