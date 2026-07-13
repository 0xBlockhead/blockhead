// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadCashuMeltQuoteSelector {
	MintMethodQuoteId = 'MintMethodQuoteId',
}
export const BlockheadCashuMeltQuote = entity({
	entityType: EntityType.BlockheadCashuMeltQuote,
	labels: {
		singular: 'blockhead Cashu melt quote',
		plural: 'blockhead Cashu melt quotes',
	},
})({
	$mint: {
		label: 'mint',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CashuMint,
		cardinality: EntityFieldCardinality.One,
	},
	method: {
		label: 'method',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	quoteId: {
		label: 'quote ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	request: {
		label: 'request',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	amount: {
		label: 'amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	unit: {
		label: 'unit',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeReserve: {
		label: 'fee reserve',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$walletState: {
		label: 'wallet state',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadCashuWalletState,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$inputProofs: {
		label: 'input proofs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BlockheadCashuProof,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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
