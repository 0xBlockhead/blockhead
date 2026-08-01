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
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	pool: {
		primitiveType: type.enumerated(...Object.values(ZcashShieldedPoolKind)),
		cardinality: EntityFieldCardinality.One,
	},
	actionKind: {
		primitiveType: type.enumerated(...Object.values(ZcashShieldedActionKind)),
		cardinality: EntityFieldCardinality.One,
	},
	indexInTransaction: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$pool: {
		entityType: EntityType.ZcashShieldedPool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nullifier: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	noteCommitment: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueCommitment: {
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
