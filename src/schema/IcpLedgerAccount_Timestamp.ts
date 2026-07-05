// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IcpLedgerAccount_TimestampSelector {
	LedgerOwnerSubaccountTimestampMsSource = 'LedgerOwnerSubaccountTimestampMsSource',
}
export default {
	entityType: EntityType.IcpLedgerAccount_Timestamp,
	label: 'icp ledger account timestamp',
	labelPlural: 'icp ledger account observations',
	selectors: [
		{
			name: IcpLedgerAccount_TimestampSelector.LedgerOwnerSubaccountTimestampMsSource,
			fields: [
				'$ledger',
				'owner',
				'subaccount',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$ledger',
				label: 'ledger',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.IcpLedgerCanister,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'owner',
				label: 'owner',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'subaccount',
				label: 'subaccount',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'balance',
				label: 'balance',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'allowanceCount',
				label: 'allowance count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
