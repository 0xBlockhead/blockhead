// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadMoneroOutputStateSelector {
	WalletIdTxHashOutputIndex = 'WalletIdTxHashOutputIndex',
}
export default {
	entityType: EntityType.BlockheadMoneroOutputState,
	label: 'blockhead monero output state',
	labelPlural: 'blockhead monero output states',
	selectors: [
		{
			name: BlockheadMoneroOutputStateSelector.WalletIdTxHashOutputIndex,
			fields: [
				'walletId',
				'txHash',
				'outputIndex',
			],
		},
	],
	fields: [
		{
			name: 'walletId',
			label: 'wallet ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$wallet',
			label: 'wallet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadWallet,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MoneroNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$stealthOutput',
			label: 'stealth output',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MoneroStealthOutput,
			cardinality: EntityFieldCardinality.ZeroOrOne,
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
			name: 'outputIndex',
			label: 'output index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'accountIndex',
			label: 'account index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'addressIndex',
			label: 'address index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amountAtomicUnits',
			label: 'amount atomic units',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'keyImage',
			label: 'key image',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'keyImageSignature',
			label: 'key image signature',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'globalOutputIndex',
			label: 'global output index',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BlockheadMoneroOutputState_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
