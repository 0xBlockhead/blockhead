// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TezosTokenTransferSelector {
	NetworkTransferIdSource = 'NetworkTransferIdSource',
}
export default {
	entityType: EntityType.TezosTokenTransfer,
	label: 'tezos token transfer',
	labelPlural: 'tezos token transfers',
	selectors: [
		{
			name: TezosTokenTransferSelector.NetworkTransferIdSource,
			fields: [
				'$network',
				'transferId',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TezosNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'transferId',
				label: 'transfer ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$token',
				label: 'token',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TezosToken,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$from',
				label: 'from',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TezosAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$to',
				label: 'to',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TezosAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$operation',
				label: 'operation',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TezosOperation,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'level',
				label: 'level',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'contractAddress',
				label: 'contract address',
				description: 'The contract address on its network.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'tokenId',
				label: 'Token ID',
				description: 'The token identifier within its collection or contract.',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'amount',
				label: 'amount',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'standard',
				label: 'standard',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'transactionId',
				label: 'transaction ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
