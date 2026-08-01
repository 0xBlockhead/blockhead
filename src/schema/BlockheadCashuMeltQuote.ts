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
		label: 'mint',
		entityType: EntityType.CashuMint,
		cardinality: EntityFieldCardinality.One,
	},
	method: {
		label: 'method',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	quoteId: {
		label: 'quote ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	request: {
		label: 'request',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	amount: {
		label: 'amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	unit: {
		label: 'unit',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeReserve: {
		label: 'fee reserve',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$walletState: {
		label: 'wallet state',
		entityType: EntityType.BlockheadCashuWalletState,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$inputProofs: {
		label: 'input proofs',
		entityType: EntityType.BlockheadCashuProof,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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
