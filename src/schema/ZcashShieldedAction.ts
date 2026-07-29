// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	pool: {
		label: 'Pool',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(ZcashShieldedPoolKind)),
		cardinality: EntityFieldCardinality.One,
	},
	actionKind: {
		label: 'Action kind',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(ZcashShieldedActionKind)),
		cardinality: EntityFieldCardinality.One,
	},
	indexInTransaction: {
		label: 'Index in transaction',
		type: EntityFieldType.Primitive,
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$pool: {
		label: 'Pool',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ZcashShieldedPool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nullifier: {
		label: 'Nullifier',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	noteCommitment: {
		label: 'Note commitment',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueCommitment: {
		label: 'Value commitment',
		type: EntityFieldType.Primitive,
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
