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
		entityType: EntityType.HederaTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	accountId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transferIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	amountTinybar: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	isApproval: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$account: {
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
