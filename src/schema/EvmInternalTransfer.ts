// Generated from APP.ts.

import { EvmInternalCallType } from '$/constants/Evm.ts'
import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmInternalTransfer,
	labels: {
		singular: 'EVM internal transfer',
		plural: 'EVM internal transfers',
	},
	description: 'Native currency moved inside EVM transaction execution.',
})({
	$transaction: {
		label: 'Transaction',
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	indexInTransaction: {
		label: 'Index in transaction',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	$from: {
		label: 'From',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$to: {
		label: 'To',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		label: 'Value',
		description: 'Native currency moved by the internal call.',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	callType: {
		label: 'Call type',
		primitiveType: type.enumerated(...Object.values(EvmInternalCallType)),
		cardinality: EntityFieldCardinality.One,
	},
	success: {
		label: 'Success',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$createdContract: {
		label: 'Created contract',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransactionIndexInTransaction: [
			'$transaction',
			'indexInTransaction',
		],
	},
})
