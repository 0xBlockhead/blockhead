// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	accountId: {
		label: 'account ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transferIndex: {
		label: 'transfer index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	amountTinybar: {
		label: 'amount tinybar',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	isApproval: {
		label: 'is approval',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
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
