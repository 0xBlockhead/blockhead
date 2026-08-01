// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadQuilibriumPendingTransaction,
	labels: {
		singular: 'blockhead quilibrium pending transaction',
		plural: 'blockhead quilibrium pending transactions',
	},
})({
	$accountState: {
		label: 'account state',
		entityType: EntityType.BlockheadQuilibriumAccountState,
		cardinality: EntityFieldCardinality.One,
	},
	transactionAddress: {
		label: 'transaction address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		label: 'account',
		entityType: EntityType.QuilibriumAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$refundAccount: {
		label: 'refund account',
		entityType: EntityType.QuilibriumAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	coinAddress: {
		label: 'coin address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deliveryType: {
		label: 'delivery type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deliveryAddress: {
		label: 'delivery address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	observedAt: {
		label: 'observed AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AccountStateTransactionAddress: [
			'$accountState',
			'transactionAddress',
		],
	},
})
