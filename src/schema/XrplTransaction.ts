// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.XrplTransaction,
	labels: {
		singular: 'xrpl transaction',
		plural: 'xrpl transactions',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	transactionType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	account: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	sequence: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	$$timestamps: {
		entityType: EntityType.XrplTransaction_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
	$$affectedEntries: {
		entityType: EntityType.XrplLedgerEntry,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkHash: [
			'$network',
			'hash',
		],
	},
})
