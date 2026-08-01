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
		label: 'wallet ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$wallet: {
		label: 'wallet',
		entityType: EntityType.BlockheadWallet,
		cardinality: EntityFieldCardinality.ZeroOrOne,
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
	unit: {
		label: 'unit',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BlockheadCashuWalletState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$proofs: {
		label: 'proofs',
		entityType: EntityType.BlockheadCashuProof,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokens: {
		label: 'tokens',
		entityType: EntityType.BlockheadCashuToken,
		cardinality: EntityFieldCardinality.Many,
	},
	$$mintQuotes: {
		label: 'mint quotes',
		entityType: EntityType.BlockheadCashuMintQuote,
		cardinality: EntityFieldCardinality.Many,
	},
	$$meltQuotes: {
		label: 'melt quotes',
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
