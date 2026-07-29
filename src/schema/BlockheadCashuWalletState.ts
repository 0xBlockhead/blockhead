// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$wallet: {
		label: 'wallet',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadWallet,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$mint: {
		label: 'mint',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CashuMint,
		cardinality: EntityFieldCardinality.One,
	},
	mintUrl: {
		label: 'mint URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	unit: {
		label: 'unit',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadCashuWalletState_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$proofs: {
		label: 'proofs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadCashuProof,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokens: {
		label: 'tokens',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadCashuToken,
		cardinality: EntityFieldCardinality.Many,
	},
	$$mintQuotes: {
		label: 'mint quotes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadCashuMintQuote,
		cardinality: EntityFieldCardinality.Many,
	},
	$$meltQuotes: {
		label: 'melt quotes',
		type: EntityFieldType.EntitiesReference,
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
