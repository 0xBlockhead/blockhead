// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadCashuProof,
	labels: {
		singular: 'blockhead Cashu proof',
		plural: 'blockhead Cashu proofs',
	},
})({
	walletId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$mint: {
		entityType: EntityType.CashuMint,
		cardinality: EntityFieldCardinality.One,
	},
	mintUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	$keyset: {
		entityType: EntityType.CashuKeyset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	keysetId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	secretHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	amount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	unit: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	signature: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	dleqJson: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	receivedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sourceTokenId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
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
