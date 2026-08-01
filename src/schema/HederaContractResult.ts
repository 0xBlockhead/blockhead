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
		entityType: EntityType.HederaTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	$contract: {
		entityType: EntityType.HederaContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contractId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	evmAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ethereumHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	functionParameters: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasLimit: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasUsed: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountTinybar: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	errorMessage: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bloom: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$actions: {
		entityType: EntityType.HederaContractAction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$logs: {
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
