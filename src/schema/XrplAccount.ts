// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const xrplRippledSources = [
	Source.Xrpl_Rippled,
] as const

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
		defaultSources: xrplRippledSources,
	},
	$$transactions: {
		entityType: EntityType.XrplTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: xrplRippledSources,
	},
	$$trustlines: {
		entityType: EntityType.XrplTrustline,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: xrplRippledSources,
	},
	$$timestamps: {
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
