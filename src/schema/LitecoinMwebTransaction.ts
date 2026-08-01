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
		label: 'MWEB block',
		entityType: EntityType.LitecoinMwebBlock,
		cardinality: EntityFieldCardinality.One,
	},
	transactionIndex: {
		label: 'transaction index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	kernelOffset: {
		label: 'kernel offset',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$outputs: {
		label: 'outputs',
		entityType: EntityType.LitecoinMwebOutput,
		cardinality: EntityFieldCardinality.Many,
	},
	$$pegIns: {
		label: 'peg ins',
		entityType: EntityType.LitecoinMwebPegIn,
		cardinality: EntityFieldCardinality.Many,
	},
	$$pegOuts: {
		label: 'peg outs',
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
