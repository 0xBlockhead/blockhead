import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum UtxoOutputSelector {
	UtxoTransactionOutputIndex = 'utxoTransactionOutputIndex',
	TransactionOutputIndex = '$transaction+outputIndex',
}
export default {
	entityType: EntityType.UtxoOutput,
	label: 'UTXO output',
	labelPlural: 'UTXO outputs',
	selectors: [
		{
			name: UtxoOutputSelector.UtxoTransactionOutputIndex,
			fields: [
				'$transaction',
				'outputIndex',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'outputIndex',
			label: 'output index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'valueSats',
			label: 'value sats',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'scriptPubKeyAsm',
			label: 'script pub key asm',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'scriptPubKeyHex',
			label: 'script pub key hex',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'scriptPubKeyType',
			label: 'script pub key type',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
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
			name: '$elementsAsset',
			label: 'elements asset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ElementsAsset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'assetCommitment',
			label: 'asset commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'valueCommitment',
			label: 'value commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'nonceCommitment',
			label: 'nonce commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'surjectionProof',
			label: 'surjection proof',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'rangeProof',
			label: 'range proof',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'isConfidential',
			label: 'is confidential',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'isSpent',
			label: 'is spent',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$bitcoinCashCashTokenFungibleAmount',
			label: 'Bitcoin cash cash token fungible amount',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BitcoinCashCashTokenFungibleAmount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$bitcoinCashCashTokenNft',
			label: 'Bitcoin cash cash token NFT',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BitcoinCashCashTokenNft,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
