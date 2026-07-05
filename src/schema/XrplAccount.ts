// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum XrplAccountSelector {
	NetworkAccount = 'NetworkAccount',
}
export default {
	entityType: EntityType.XrplAccount,
	label: 'xrpl account',
	labelPlural: 'xrpl accounts',
	selectors: [
		{
			name: XrplAccountSelector.NetworkAccount,
			fields: [
				'$network',
				'account',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.XrplNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'account',
				label: 'account',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$ledgerEntries',
				label: 'ledger entries',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.XrplLedgerEntry,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$transactions',
				label: 'transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.XrplTransaction,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$trustlines',
				label: 'trustlines',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.XrplTrustline,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.XrplAccount_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
