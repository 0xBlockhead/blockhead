// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CosmosMessage,
	labels: {
		singular: 'Cosmos message',
		plural: 'Cosmos messages',
	},
})({
	$transaction: {
		label: 'Transaction',
		entityType: EntityType.CosmosTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	indexInTransaction: {
		label: 'Index in transaction',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	typeUrl: {
		label: 'Type URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	moduleName: {
		label: 'Module name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	messageName: {
		label: 'Message name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$signer: {
		label: 'Signer',
		entityType: EntityType.CosmosAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	signerAddress: {
		label: 'Signer address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	senderAddress: {
		label: 'Sender address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	granteeAddress: {
		label: 'Grantee address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	granterAddress: {
		label: 'Granter address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	contractAddress: {
		label: 'Contract address',
		description: 'The contract address on its network.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$contract: {
		label: 'Contract',
		entityType: EntityType.CosmosContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	funds: {
		label: 'Funds',
		primitiveType: type({
			denom: type('string'),
			amount: type('bigint'),
		}),
		cardinality: EntityFieldCardinality.Many,
	},
	eventTypes: {
		label: 'Event types',
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
