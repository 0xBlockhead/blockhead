// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.XrplAccount,
	labels: {
		singular: 'xrpl account',
		plural: 'xrpl accounts',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	account: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$ledgerEntries: {
		entityType: EntityType.XrplLedgerEntry,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Xrpl_Rippled,
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
	$$trustlines: {
		entityType: EntityType.XrplTrustline,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Xrpl_Rippled,
		],
	},
	$$timestamps: {
		entityType: EntityType.XrplAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Bithomp,
			Source.Xrpl_Rippled,
			Source.XrpScan_Rest,
		],
	},
})({
	selectors: {
		NetworkAccount: [
			'$network',
			'account',
		],
	},
})
