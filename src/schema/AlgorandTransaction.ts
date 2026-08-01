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
		label: 'network',
		entityType: EntityType.AlgorandNetwork,
		cardinality: EntityFieldCardinality.One,
	},
	txId: {
		label: 'transaction ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	round: {
		label: 'round',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sender: {
		label: 'sender',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionType: {
		label: 'transaction type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	fee: {
		label: 'fee',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	group: {
		label: 'group',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$group: {
		label: 'group',
		entityType: EntityType.AlgorandTransactionGroup,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parentTransactionId: {
		label: 'parent transaction ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	innerTransactionIndex: {
		label: 'inner transaction index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	innerTxns: {
		label: 'inner txns',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	logs: {
		label: 'logs',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	payload: {
		label: 'payload',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$proofs: {
		label: 'proofs',
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
