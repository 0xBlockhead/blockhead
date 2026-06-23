import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CosmosMessageSelector {
	CosmosTransactionMessageIndex = 'cosmosTransactionMessageIndex',
	TransactionMessageIndex = '$transaction+messageIndex',
}
export default {
	entityType: EntityType.CosmosMessage,
	label: 'Cosmos message',
	labelPlural: 'Cosmos messages',
	selectors: [
		{
			name: CosmosMessageSelector.CosmosTransactionMessageIndex,
			fields: [
				'$transaction',
				'messageIndex',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'messageIndex',
			label: 'message index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'typeUrl',
			label: 'type URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'moduleName',
			label: 'module name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'messageName',
			label: 'message name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$signer',
			label: 'signer',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'signerAddress',
			label: 'signer address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'senderAddress',
			label: 'sender address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'granteeAddress',
			label: 'grantee address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'granterAddress',
			label: 'granter address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$contract',
			label: 'contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'contractAddress',
			label: 'contract address',
			description: 'The contract address on its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'funds',
			label: 'funds',
			type: EntityFieldType.Primitive,
			primitiveType: type({"denom": "string", "amount": "bigint"}),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'eventTypes',
			label: 'event types',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'payload',
			label: 'payload',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
