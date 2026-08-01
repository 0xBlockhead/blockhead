// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedActionKind.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPoolKind.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ZcashShieldedAction,
	labels: {
		singular: 'Zcash shielded action',
		plural: 'Zcash shielded actions',
	},
})({
	$transaction: {
		label: 'Transaction',
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	pool: {
		label: 'Pool',
		primitiveType: type.enumerated(...Object.values(ZcashShieldedPoolKind)),
		cardinality: EntityFieldCardinality.One,
	},
	actionKind: {
		label: 'Action kind',
		primitiveType: type.enumerated(...Object.values(ZcashShieldedActionKind)),
		cardinality: EntityFieldCardinality.One,
	},
	indexInTransaction: {
		label: 'Index in transaction',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$pool: {
		label: 'Pool',
		entityType: EntityType.ZcashShieldedPool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nullifier: {
		label: 'Nullifier',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	noteCommitment: {
		label: 'Note commitment',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueCommitment: {
		label: 'Value commitment',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransactionPoolActionKindIndexInTransaction: [
			'$transaction',
			'pool',
			'actionKind',
			'indexInTransaction',
		],
	},
})
