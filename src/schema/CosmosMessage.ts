// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CosmosMessageSelector {
	TransactionIndexInTransaction = 'TransactionIndexInTransaction',
}
export const CosmosMessage = entity({
	entityType: EntityType.CosmosMessage,
	labels: {
		singular: 'Cosmos message',
		plural: 'Cosmos messages',
	},
})({
	$transaction: {
		label: 'Transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CosmosTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	indexInTransaction: {
		label: 'Index in transaction',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	typeUrl: {
		label: 'Type URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	moduleName: {
		label: 'Module name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	messageName: {
		label: 'Message name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$signer: {
		label: 'Signer',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CosmosAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signerAddress: {
		label: 'Signer address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	senderAddress: {
		label: 'Sender address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	granteeAddress: {
		label: 'Grantee address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	granterAddress: {
		label: 'Granter address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contractAddress: {
		label: 'Contract address',
		description: 'The contract address on its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$contract: {
		label: 'Contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CosmosContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	funds: {
		label: 'Funds',
		type: EntityFieldType.Primitive,
		primitiveType: type({ 'denom': type('string'), 'amount': type('bigint') }),
		cardinality: EntityFieldCardinality.Many,
	},
	eventTypes: {
		label: 'Event types',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		TransactionIndexInTransaction: [
			'$transaction',
			'indexInTransaction',
		],
	},
})
