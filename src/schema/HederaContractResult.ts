// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.HederaContractResult,
	labels: {
		singular: 'hedera contract result',
		plural: 'hedera contract results',
	},
})({
	$transaction: {
		label: 'transaction',
		entityType: EntityType.HederaTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	$contract: {
		label: 'contract',
		entityType: EntityType.HederaContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contractId: {
		label: 'contract ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	evmAddress: {
		label: 'EVM address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ethereumHash: {
		label: 'ethereum hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	functionParameters: {
		label: 'function parameters',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasLimit: {
		label: 'gas limit',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasUsed: {
		label: 'gas used',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountTinybar: {
		label: 'amount tinybar',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	errorMessage: {
		label: 'error message',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bloom: {
		label: 'bloom',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$actions: {
		label: 'actions',
		entityType: EntityType.HederaContractAction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$logs: {
		label: 'logs',
		entityType: EntityType.HederaContractLog,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Transaction: [
			'$transaction',
		],
	},
})
