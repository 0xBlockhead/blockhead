// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.XrplLedger,
	labels: {
		singular: 'xrpl ledger',
		plural: 'xrpl ledgers',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	ledgerIndex: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	ledgerHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	closeTimeMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	validated: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
		],
	},
	totalCoinsDrops: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	parentHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	accountHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
		],
	},
	transactionHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	$$transactions: {
		entityType: EntityType.XrplTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	$$ledgerEntries: {
		entityType: EntityType.XrplLedgerEntry,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Xrpl_Rippled,
		],
	},
})({
	selectors: {
		NetworkLedgerIndex: [
			'$network',
			'ledgerIndex',
		],
		NetworkLedgerHash: [
			'$network',
			'ledgerHash',
		],
	},
})
