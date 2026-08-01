// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IcpLedgerTransaction,
	labels: {
		singular: 'icp ledger transaction',
		plural: 'icp ledger transactions',
	},
})({
	$block: {
		label: 'block',
		entityType: EntityType.IcpLedgerBlock,
		cardinality: EntityFieldCardinality.One,
	},
	transactionIndex: {
		label: 'transaction index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionHash: {
		label: 'transaction hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	operationKind: {
		label: 'operation kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fromAccount: {
		label: 'from account',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toAccount: {
		label: 'to account',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spenderAccount: {
		label: 'spender account',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fee: {
		label: 'fee',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	memo: {
		label: 'memo',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAtTimeNs: {
		label: 'created AT time ns',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$ledger: {
		label: 'ledger',
		entityType: EntityType.IcpLedgerCanister,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		BlockTransactionIndex: [
			'$block',
			'transactionIndex',
		],
	},
})
