// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.LitecoinMwebOutput,
	labels: {
		singular: 'litecoin MWEB output',
		plural: 'litecoin MWEB outputs',
	},
})({
	$transaction: {
		entityType: EntityType.LitecoinMwebTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	outputIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	commitment: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	senderPubkey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$localOutputState: {
		entityType: EntityType.BlockheadLitecoinMwebOutputState,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		LitecoinMwebTransactionOutputIndex: [
			'$transaction',
			'outputIndex',
		],
	},
})
