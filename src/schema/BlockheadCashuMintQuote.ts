// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadCashuMintQuote,
	labels: {
		singular: 'blockhead Cashu mint quote',
		plural: 'blockhead Cashu mint quotes',
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
	unit: {
		label: 'unit',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$walletState: {
		label: 'wallet state',
		entityType: EntityType.BlockheadCashuWalletState,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.BlockheadCashuMintQuote_Timestamp,
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
