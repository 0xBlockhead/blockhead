// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.IcpLedgerBlock,
		cardinality: EntityFieldCardinality.One,
	},
	transactionIndex: {
		label: 'transaction index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionHash: {
		label: 'transaction hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	operationKind: {
		label: 'operation kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fromAccount: {
		label: 'from account',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toAccount: {
		label: 'to account',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spenderAccount: {
		label: 'spender account',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fee: {
		label: 'fee',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	memo: {
		label: 'memo',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAtTimeNs: {
		label: 'created AT time ns',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$ledger: {
		label: 'ledger',
		type: EntityFieldType.EntityReference,
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
