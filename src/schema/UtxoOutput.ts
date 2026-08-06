// Generated from APP.ts.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.UtxoOutput,
	labels: {
		singular: 'UTXO output',
		plural: 'UTXO outputs',
	},
	description: 'Shared UTXO output identity. Explicit sats stay on the base row; Elements/Liquid confidential commitments live only under the Confidential facet gated by isConfidential, not as optional noise on every Bitcoin UTXO.',
})({
	$transaction: {
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	indexInTransaction: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	valueSats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	scriptPubKeyAsm: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	scriptPubKeyHex: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	scriptPubKeyType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$address: {
		entityType: EntityType.UtxoAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isConfidential: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isSpent: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$bitcoinCashCashTokenFungibleAmount: {
		entityType: EntityType.BitcoinCashCashTokenFungibleAmount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$bitcoinCashCashTokenNft: {
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

	facets: {
		Confidential: facet({
			path: [
				'isConfidential',
			],
			is: true,
		})({
			assetCommitment: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			valueCommitment: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			nonceCommitment: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			surjectionProof: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
			rangeProof: {
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
			},
		}),
	},
})
