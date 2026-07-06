// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum UtxoOutputSelector {
	TransactionIndexInTransaction = 'TransactionIndexInTransaction',
}
export default {
	entityType: EntityType.UtxoOutput,
	label: 'UTXO output',
	labelPlural: 'UTXO outputs',
	selectors: [
		{
			name: UtxoOutputSelector.TransactionIndexInTransaction,
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
			entityType: EntityType.UtxoTransaction,
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
			name: 'valueSats',
			label: 'Value',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'scriptPubKeyAsm',
			label: 'Script pub key asm',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'scriptPubKeyHex',
			label: 'Script pub key hex',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'scriptPubKeyType',
			label: 'Script pub key type',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$address',
			label: 'Address',
			description: 'The address or account identifier used by the source protocol.',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoAddress,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'assetCommitment',
			label: 'Asset commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'valueCommitment',
			label: 'Value commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nonceCommitment',
			label: 'Nonce commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'surjectionProof',
			label: 'Surjection proof',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'rangeProof',
			label: 'Range proof',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'isConfidential',
			label: 'Confidential',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'isSpent',
			label: 'Spent',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$bitcoinCashCashTokenFungibleAmount',
			label: 'Bitcoin Cash CashToken fungible amount',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BitcoinCashCashTokenFungibleAmount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$bitcoinCashCashTokenNft',
			label: 'Bitcoin Cash CashToken NFT',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BitcoinCashCashTokenNft,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
