// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.XrplAmm_Timestamp,
	labels: {
		singular: 'xrpl amm timestamp',
		plural: 'xrpl amm observations',
	},
})({
	$amm: {
		label: 'amm',
		entityType: EntityType.XrplAmm,
		cardinality: EntityFieldCardinality.One,
	},
	ledgerIndex: {
		label: 'ledger index',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	assetAmount: {
		label: 'asset amount',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	asset2Amount: {
		label: 'asset2 amount',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lpTokenBalance: {
		label: 'lp token balance',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tradingFee: {
		label: 'trading fee',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	auctionSlot: {
		label: 'auction slot',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	voteSlots: {
		label: 'vote slots',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$ledgerEntry: {
		label: 'ledger entry',
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
