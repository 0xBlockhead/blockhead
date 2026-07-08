// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum XrplNetworkSelector {
	Network = 'Network',
}
export const XrplNetwork = entity({
	entityType: EntityType.XrplNetwork,
	label: 'xrpl network',
	labelPlural: 'xrpl networks',
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	$$ledgers: {
		label: 'ledgers',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.XrplLedger,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.XrplTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$accounts: {
		label: 'accounts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.XrplAccount,
		cardinality: EntityFieldCardinality.Many,
	},
	$$ledgerEntries: {
		label: 'ledger entries',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.XrplLedgerEntry,
		cardinality: EntityFieldCardinality.Many,
	},
	$$amendments: {
		label: 'amendments',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.XrplAmendment,
		cardinality: EntityFieldCardinality.Many,
	},
	$$amms: {
		label: 'amms',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.XrplAmm,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.XrplNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})
