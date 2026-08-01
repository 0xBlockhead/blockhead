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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	account: {
		label: 'account',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$ledgerEntries: {
		label: 'ledger entries',
		entityType: EntityType.XrplLedgerEntry,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Xrpl_Rippled,
		],
	},
	$$transactions: {
		label: 'transactions',
		entityType: EntityType.XrplTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Xrpl_Rippled,
		],
	},
	$$trustlines: {
		label: 'trustlines',
		entityType: EntityType.XrplTrustline,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Xrpl_Rippled,
		],
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.XrplAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Bithomp,
			Source.Xrpl_Rippled,
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
