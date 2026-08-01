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
		label: 'Transaction',
		entityType: EntityType.EvmTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	traceAddress: {
		label: 'Trace address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	index: {
		label: 'Index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	type: {
		label: 'Type',
		description: 'The EVM call-frame operation.',
		primitiveType: type.enumerated(...Object.values(EvmInternalCallType)),
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
		description: 'The native asset amount transferred by the call frame.',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gas: {
		label: 'Gas',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasUsed: {
		label: 'Gas used',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	input: {
		label: 'Input',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	output: {
		label: 'Output',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'Error',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$children: {
		label: 'Children',
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
