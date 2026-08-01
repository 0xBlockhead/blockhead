// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadCashuWalletState,
	labels: {
		singular: 'blockhead Cashu wallet state',
		plural: 'blockhead Cashu wallet states',
	},
})({
	walletId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$wallet: {
		entityType: EntityType.BlockheadWallet,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$mint: {
		entityType: EntityType.CashuMint,
		cardinality: EntityFieldCardinality.One,
	},
	mintUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	unit: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.BlockheadCashuWalletState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$proofs: {
		entityType: EntityType.BlockheadCashuProof,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokens: {
		entityType: EntityType.BlockheadCashuToken,
		cardinality: EntityFieldCardinality.Many,
	},
	$$mintQuotes: {
		entityType: EntityType.BlockheadCashuMintQuote,
		cardinality: EntityFieldCardinality.Many,
	},
	$$meltQuotes: {
		entityType: EntityType.BlockheadCashuMeltQuote,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		WalletIdMintUrlUnit: [
			'walletId',
			'mintUrl',
			'unit',
		],
	},
})
