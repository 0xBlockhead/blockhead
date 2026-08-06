// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.XrplAmm_Timestamp,
	labels: {
		singular: 'xrpl amm timestamp',
		plural: 'xrpl amm observations',
	},
})({
	$amm: {
		entityType: EntityType.XrplAmm,
		cardinality: EntityFieldCardinality.One,
	},
	ledgerIndex: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	assetAmount: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	asset2Amount: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	lpTokenBalance: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	tradingFee: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	auctionSlot: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	voteSlots: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	$ledgerEntry: {
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
