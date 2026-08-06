// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.XrplLedgerEntry,
	labels: {
		singular: 'xrpl ledger entry',
		plural: 'xrpl ledger entries',
	},
})({
	$ledger: {
		entityType: EntityType.XrplLedger,
		cardinality: EntityFieldCardinality.One,
	},
	entryHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	entryType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	account: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	previousTransactionHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	previousTransactionLedgerIndex: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	fields: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
})({
	selectors: {
		LedgerEntryHash: [
			'$ledger',
			'entryHash',
		],
	},
})
