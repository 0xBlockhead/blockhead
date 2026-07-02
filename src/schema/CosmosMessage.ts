// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CosmosMessageSelector {
	TransactionIndexInTransaction = 'TransactionIndexInTransaction',
}
export default {
	entityType: EntityType.CosmosMessage,
	label: 'Cosmos message',
	labelPlural: 'Cosmos messages',
	selectors: [
		{
			name: CosmosMessageSelector.TransactionIndexInTransaction,
			fields: [
				'$transaction',
				'indexInTransaction',
			],
		},
	],
	fields: [
		{
				name: '$transaction',
				label: 'Transaction',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.CosmosTransaction,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'indexInTransaction',
				label: 'Index in transaction',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'typeUrl',
				label: 'Type URL',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'moduleName',
				label: 'Module name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'messageName',
				label: 'Message name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$signer',
				label: 'Signer',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.CosmosAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'signerAddress',
				label: 'Signer address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'senderAddress',
				label: 'Sender address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'granteeAddress',
				label: 'Grantee address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'granterAddress',
				label: 'Granter address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'contractAddress',
				label: 'Contract address',
				description: 'The contract address on its network.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$contract',
				label: 'Contract',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.CosmosContract,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'funds',
				label: 'Funds',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'denom': type('string'), 'amount': type('bigint') }),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'eventTypes',
				label: 'Event types',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
