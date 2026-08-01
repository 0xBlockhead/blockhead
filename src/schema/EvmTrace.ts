// Generated from APP.ts.

import { EvmInternalCallType } from '$/constants/Evm.ts'
import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmTrace,
	labels: {
		singular: 'EVM trace',
		plural: 'EVM traces',
	},
})({
	$transaction: {
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	traceAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	index: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	type: {
		primitiveType: type.enumerated(...Object.values(EvmInternalCallType)),
		cardinality: EntityFieldCardinality.One,
	},
	$from: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$to: {
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	value: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gas: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasUsed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	input: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	output: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$children: {
		entityType: EntityType.EvmTrace,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		TransactionTraceAddress: [
			'$transaction',
			'traceAddress',
		],
	},
})
