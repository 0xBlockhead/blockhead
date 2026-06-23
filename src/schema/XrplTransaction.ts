import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum XrplTransactionSelector {
	NetworkHash = '$network+hash',
}
export default {
	entityType: EntityType.XrplTransaction,
	label: 'xrpl transaction',
	labelPlural: 'xrpl transactions',
	selectors: [
		{
			name: XrplTransactionSelector.NetworkHash,
			fields: [
				'$network',
				'hash',
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
			name: 'hash',
			label: 'Hash',
			description: 'The hash that identifies this object in its protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transactionType',
			label: 'transaction type',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'account',
			label: 'account',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sequence',
			label: 'sequence',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.XrplTransaction_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$affectedEntries',
			label: 'affected entries',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.XrplLedgerEntry,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
