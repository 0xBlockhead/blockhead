// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum XrplLedgerSelector {
	NetworkLedgerIndex = 'NetworkLedgerIndex',
	NetworkLedgerHash = 'NetworkLedgerHash',
}
export default {
	entityType: EntityType.XrplLedger,
	label: 'xrpl ledger',
	labelPlural: 'xrpl ledgers',
	selectors: [
		{
			name: XrplLedgerSelector.NetworkLedgerIndex,
			fields: [
				'$network',
				'ledgerIndex',
			],
		},
		{
			name: XrplLedgerSelector.NetworkLedgerHash,
			fields: [
				'$network',
				'ledgerHash',
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
			name: 'ledgerIndex',
			label: 'ledger index',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ledgerHash',
			label: 'ledger hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'closeTimeMs',
			label: 'close time ms',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'validated',
			label: 'validated',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'totalCoinsDrops',
			label: 'total coins drops',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'parentHash',
			label: 'parent hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'accountHash',
			label: 'account hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transactionHash',
			label: 'transaction hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.XrplTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$ledgerEntries',
			label: 'ledger entries',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.XrplLedgerEntry,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
