// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum XrplLedgerEntrySelector {
	LedgerEntryHash = 'LedgerEntryHash',
}
export const XrplLedgerEntry = entity({
	entityType: EntityType.XrplLedgerEntry,
	labels: {
		singular: 'xrpl ledger entry',
		plural: 'xrpl ledger entries',
	},
})({
	$ledger: {
		label: 'ledger',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.XrplLedger,
		cardinality: EntityFieldCardinality.One,
	},
	entryHash: {
		label: 'entry hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	entryType: {
		label: 'entry type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	account: {
		label: 'account',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previousTransactionHash: {
		label: 'previous transaction hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previousTransactionLedgerIndex: {
		label: 'previous transaction ledger index',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fields: {
		label: 'fields',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		LedgerEntryHash: [
			'$ledger',
			'entryHash',
		],
	},
})
