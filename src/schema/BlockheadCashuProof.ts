// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadCashuProof,
	labels: {
		singular: 'blockhead Cashu proof',
		plural: 'blockhead Cashu proofs',
	},
})({
	walletId: {
		label: 'wallet ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$mint: {
		label: 'mint',
		entityType: EntityType.CashuMint,
		cardinality: EntityFieldCardinality.One,
	},
	mintUrl: {
		label: 'mint URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$keyset: {
		label: 'keyset',
		entityType: EntityType.CashuKeyset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	keysetId: {
		label: 'keyset ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	secretHash: {
		label: 'secret hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	secret: {
		label: 'secret',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	unit: {
		label: 'unit',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	signature: {
		label: 'signature',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	dleqJson: {
		label: 'dleq JSON',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	receivedAt: {
		label: 'received AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceTokenId: {
		label: 'source token ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BlockheadCashuProof_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		WalletIdMintUrlKeysetIdSecretHash: [
			'walletId',
			'mintUrl',
			'keysetId',
			'secretHash',
		],
	},
})
