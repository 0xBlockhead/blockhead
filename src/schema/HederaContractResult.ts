// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum HederaContractResultSelector {
	Transaction = 'Transaction',
}
export const HederaContractResult = entity({
	entityType: EntityType.HederaContractResult,
	label: 'hedera contract result',
	labelPlural: 'hedera contract results',
})({
	$transaction: {
		label: 'transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	$contract: {
		label: 'contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.HederaContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contractId: {
		label: 'contract ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	evmAddress: {
		label: 'EVM address',
		type: EntityFieldType.Primitive,
		primitiveType: (EvmAddress),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ethereumHash: {
		label: 'ethereum hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	functionParameters: {
		label: 'function parameters',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasLimit: {
		label: 'gas limit',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	gasUsed: {
		label: 'gas used',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amountTinybar: {
		label: 'amount tinybar',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	errorMessage: {
		label: 'error message',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	bloom: {
		label: 'bloom',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$actions: {
		label: 'actions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.HederaContractAction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$logs: {
		label: 'logs',
		type: EntityFieldType.EntitiesReference,
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
