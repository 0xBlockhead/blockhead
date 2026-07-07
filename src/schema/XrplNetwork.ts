// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum XrplNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.XrplNetwork,
	label: 'xrpl network',
	labelPlural: 'xrpl networks',
	selectors: [
		{
			name: XrplNetworkSelector.Network,
			fields: [
				'$network',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$ledgers',
			label: 'ledgers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.XrplLedger,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.XrplTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$accounts',
			label: 'accounts',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.XrplAccount,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$ledgerEntries',
			label: 'ledger entries',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.XrplLedgerEntry,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$amendments',
			label: 'amendments',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.XrplAmendment,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$amms',
			label: 'amms',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.XrplAmm,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.XrplNetwork_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
