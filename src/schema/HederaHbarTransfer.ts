// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HederaHbarTransfer,
	labels: {
		singular: 'hedera hbar transfer',
		plural: 'hedera hbar transfers',
	},
})({
	$transaction: {
		label: 'transaction',
		entityType: EntityType.HederaTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	accountId: {
		label: 'account ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transferIndex: {
		label: 'transfer index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	amountTinybar: {
		label: 'amount tinybar',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	isApproval: {
		label: 'is approval',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$account: {
		label: 'account',
		entityType: EntityType.HederaAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransactionAccountIdTransferIndex: [
			'$transaction',
			'accountId',
			'transferIndex',
		],
	},
})
