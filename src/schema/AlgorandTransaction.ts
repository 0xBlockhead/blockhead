// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AlgorandTransaction,
	labels: {
		singular: 'algorand transaction',
		plural: 'algorand transactions',
	},
})({
	$network: {
		entityType: EntityType.AlgorandNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	txId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	round: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sender: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fee: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	group: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$group: {
		entityType: EntityType.AlgorandTransactionGroup,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parentTransactionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	innerTransactionIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	innerTxns: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	logs: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	payload: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$proofs: {
		entityType: EntityType.AlgorandTransactionProof,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkTxId: [
			'$network',
			'txId',
		],
	},
})
