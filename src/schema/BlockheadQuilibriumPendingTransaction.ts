// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadQuilibriumAccountState,
		cardinality: EntityFieldCardinality.One,
	},
	transactionAddress: {
		label: 'transaction address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.QuilibriumAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$refundAccount: {
		label: 'refund account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.QuilibriumAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	coinAddress: {
		label: 'coin address',
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
	deliveryType: {
		label: 'delivery type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deliveryAddress: {
		label: 'delivery address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	observedAt: {
		label: 'observed AT',
		type: EntityFieldType.Primitive,
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
