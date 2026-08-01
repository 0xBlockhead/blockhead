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
		label: 'transaction',
		entityType: EntityType.LitecoinMwebTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	outputIndex: {
		label: 'output index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	commitment: {
		label: 'commitment',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	senderPubkey: {
		label: 'sender public key',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$localOutputState: {
		label: 'local output state',
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
