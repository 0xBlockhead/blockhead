// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	account: {
		label: 'account',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$ledgerEntries: {
		label: 'ledger entries',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.XrplLedgerEntry,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Xrpl_Rippled,
		],
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.XrplTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Xrpl_Rippled,
		],
	},
	$$trustlines: {
		label: 'trustlines',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.XrplTrustline,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Xrpl_Rippled,
		],
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.XrplAccount_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
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
