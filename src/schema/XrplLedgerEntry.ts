import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum XrplLedgerEntrySelector {
	LedgerEntryHash = '$ledger+entryHash',
}
export default {
	entityType: EntityType.XrplLedgerEntry,
	label: 'xrpl ledger entry',
	labelPlural: 'xrpl ledger entries',
	selectors: [
		{
			name: XrplLedgerEntrySelector.LedgerEntryHash,
			fields: [
				'$ledger',
				'entryHash',
			],
		},
	],
	fields: [
		{
			name: '$ledger',
			label: 'ledger',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.XrplLedger,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'entryHash',
			label: 'entry hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'entryType',
			label: 'entry type',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'account',
			label: 'account',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'previousTransactionHash',
			label: 'previous transaction hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'previousTransactionLedgerIndex',
			label: 'previous transaction ledger index',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'fields',
			label: 'fields',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition
