// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StarknetTransactionSelector {
	NetworkTransactionHash = 'NetworkTransactionHash',
}
export default {
	entityType: EntityType.StarknetTransaction,
	label: 'starknet transaction',
	labelPlural: 'starknet transactions',
	selectors: [
		{
			name: StarknetTransactionSelector.NetworkTransactionHash,
			fields: [
				'$network',
				'transactionHash',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StarknetNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transactionHash',
			label: 'transaction hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transactionKind',
			label: 'transaction kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$block',
			label: 'block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StarknetBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'senderAddress',
			label: 'sender address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$senderContract',
			label: 'sender contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.StarknetContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nonce',
			label: 'nonce',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'version',
			label: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'maxFee',
			label: 'max fee',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'resourceBounds',
			label: 'resource bounds',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'calldata',
			label: 'calldata',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'signature',
			label: 'signature',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$events',
			label: 'events',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StarknetEvent,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.StarknetTransaction_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
