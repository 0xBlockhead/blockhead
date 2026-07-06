// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ArweaveTransactionSelector {
	NetworkTransactionId = 'NetworkTransactionId',
}
export default {
	entityType: EntityType.ArweaveTransaction,
	label: 'arweave transaction',
	labelPlural: 'arweave transactions',
	selectors: [
		{
			name: ArweaveTransactionSelector.NetworkTransactionId,
			fields: [
				'$network',
				'transactionId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ArweaveNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transactionId',
			label: 'transaction ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'ownerAddress',
			label: 'owner address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'targetAddress',
			label: 'target address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'quantityWinston',
			label: 'quantity winston',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'rewardWinston',
			label: 'reward winston',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'signature',
			label: 'signature',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastTx',
			label: 'last transaction',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'dataRoot',
			label: 'data root',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'dataSizeBytes',
			label: 'data size bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'dataTree',
			label: 'data tree',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'tags',
			label: 'tags',
			type: EntityFieldType.Primitive,
			primitiveType: type({ 'name': type('string'), 'value': type('string') }),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'format',
			label: 'format',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'denomination',
			label: 'denomination',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$block',
			label: 'block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ArweaveBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$resource',
			label: 'resource',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ArweaveResource,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
