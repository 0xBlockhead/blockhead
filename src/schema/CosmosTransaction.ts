// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CosmosTransactionSelector {
	NetworkTxHash = 'NetworkTxHash',
}
export default {
	entityType: EntityType.CosmosTransaction,
	label: 'Cosmos transaction',
	labelPlural: 'Cosmos transactions',
	selectors: [
		{
			name: CosmosTransactionSelector.NetworkTxHash,
			fields: [
				'$network',
				'txHash',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'txHash',
				label: 'Transaction hash',
				description: 'The transaction hash in its network.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$block',
				label: 'Block',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.CosmosBlock,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'code',
				label: 'Code',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'codespace',
				label: 'Codespace',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'gasWanted',
				label: 'Gas wanted',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'gasUsed',
				label: 'Gas used',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'feeAmount',
				label: 'Fee amount',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'denom': type('string'), 'amount': type('bigint') }),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'feeGasLimit',
				label: 'Fee gas limit',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'memo',
				label: 'Memo',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'timeoutHeight',
				label: 'Timeout height',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'signerAddresses',
				label: 'Signer addresses',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'signatures',
				label: 'Signatures',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'rawLog',
				label: 'Raw log',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'eventTypes',
				label: 'Event types',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$messages',
				label: 'Messages',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CosmosMessage,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
