// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HederaContractAction,
	labels: {
		singular: 'hedera contract action',
		plural: 'hedera contract actions',
	},
})({
	$result: {
		label: 'result',
		entityType: EntityType.HederaContractResult,
		cardinality: EntityFieldCardinality.One,
	},
	callDepth: {
		label: 'call depth',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	callIndex: {
		label: 'call index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	callType: {
		label: 'call type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fromAddress: {
		label: 'from address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toAddress: {
		label: 'to address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gas: {
		label: 'gas',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasUsed: {
		label: 'gas used',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueTinybar: {
		label: 'value tinybar',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	input: {
		label: 'input',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	output: {
		label: 'output',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		label: 'error',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ResultCallDepthCallIndex: [
			'$result',
			'callDepth',
			'callIndex',
		],
	},
})
