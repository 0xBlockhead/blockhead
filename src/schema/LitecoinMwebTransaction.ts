// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LitecoinMwebTransaction,
	labels: {
		singular: 'litecoin MWEB transaction',
		plural: 'litecoin MWEB transactions',
	},
})({
	$mwebBlock: {
		entityType: EntityType.LitecoinMwebBlock,
		cardinality: EntityFieldCardinality.One,
	},
	transactionIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	kernelOffset: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$outputs: {
		entityType: EntityType.LitecoinMwebOutput,
		cardinality: EntityFieldCardinality.Many,
	},
	$$pegIns: {
		entityType: EntityType.LitecoinMwebPegIn,
		cardinality: EntityFieldCardinality.Many,
	},
	$$pegOuts: {
		entityType: EntityType.LitecoinMwebPegOut,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		LitecoinMwebBlockTransactionIndex: [
			'$mwebBlock',
			'transactionIndex',
		],
	},
})
