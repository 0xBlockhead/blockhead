// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum XrplAmm_TimestampSelector {
	AmmLedgerIndexSource = 'AmmLedgerIndexSource',
}
export const XrplAmm_Timestamp = entity({
	entityType: EntityType.XrplAmm_Timestamp,
	label: 'xrpl amm timestamp',
	labelPlural: 'xrpl amm observations',
})({
	$amm: {
		label: 'amm',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.XrplAmm,
		cardinality: EntityFieldCardinality.One,
	},
	ledgerIndex: {
		label: 'ledger index',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	assetAmount: {
		label: 'asset amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	asset2Amount: {
		label: 'asset2 amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lpTokenBalance: {
		label: 'lp token balance',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tradingFee: {
		label: 'trading fee',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	auctionSlot: {
		label: 'auction slot',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	voteSlots: {
		label: 'vote slots',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$ledgerEntry: {
		label: 'ledger entry',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.XrplLedgerEntry,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AmmLedgerIndexSource: [
			'$amm',
			'ledgerIndex',
			'source',
		],
	},
})
