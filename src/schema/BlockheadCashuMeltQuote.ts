// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadCashuMeltQuote,
	labels: {
		singular: 'blockhead Cashu melt quote',
		plural: 'blockhead Cashu melt quotes',
	},
})({
	$mint: {
		entityType: EntityType.CashuMint,
		cardinality: EntityFieldCardinality.One,
	},
	method: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	quoteId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	request: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	amount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	unit: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeReserve: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$walletState: {
		entityType: EntityType.BlockheadCashuWalletState,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$inputProofs: {
		entityType: EntityType.BlockheadCashuProof,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType.BlockheadCashuMeltQuote_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		MintMethodQuoteId: [
			'$mint',
			'method',
			'quoteId',
		],
	},
})
