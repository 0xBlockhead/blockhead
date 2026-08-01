// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.UtxoOutput,
	labels: {
		singular: 'UTXO output',
		plural: 'UTXO outputs',
	},
})({
	$transaction: {
		label: 'Transaction',
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	indexInTransaction: {
		label: 'Index in transaction',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	valueSats: {
		label: 'Value',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	scriptPubKeyAsm: {
		label: 'Script pub key asm',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	scriptPubKeyHex: {
		label: 'Script pub key hex',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	scriptPubKeyType: {
		label: 'Script pub key type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		entityType: EntityType.UtxoAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	assetCommitment: {
		label: 'Asset commitment',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	valueCommitment: {
		label: 'Value commitment',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	nonceCommitment: {
		label: 'Nonce commitment',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	surjectionProof: {
		label: 'Surjection proof',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rangeProof: {
		label: 'Range proof',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isConfidential: {
		label: 'Confidential',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isSpent: {
		label: 'Spent',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$bitcoinCashCashTokenFungibleAmount: {
		label: 'Bitcoin Cash CashToken fungible amount',
		entityType: EntityType.BitcoinCashCashTokenFungibleAmount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$bitcoinCashCashTokenNft: {
		label: 'Bitcoin Cash CashToken NFT',
		entityType: EntityType.BitcoinCashCashTokenNft,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransactionIndexInTransaction: [
			'$transaction',
			'indexInTransaction',
		],
	},
})
