// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IcpLedgerCanisterSelector {
	Canister = 'Canister',
}
export default {
	entityType: EntityType.IcpLedgerCanister,
	label: 'icp ledger canister',
	labelPlural: 'icp ledger canisters',
	selectors: [
		{
			name: IcpLedgerCanisterSelector.Canister,
			fields: [
				'$canister',
			],
		},
	],
	fields: [
		{
			name: '$canister',
			label: 'canister',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.IcpCanister,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'ledgerStandard',
			label: 'ledger standard',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.IcpLedgerCanister_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$accountTimestamps',
			label: 'account timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.IcpLedgerAccount_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$blocks',
			label: 'blocks',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.IcpLedgerBlock,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.IcpLedgerTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
