// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum XrplTransaction_TimestampSelector {
	TransactionLedgerIndexSource = 'TransactionLedgerIndexSource',
}
export const XrplTransaction_Timestamp = entity({
	entityType: EntityType.XrplTransaction_Timestamp,
	labels: {
		singular: 'xrpl transaction timestamp',
		plural: 'xrpl transaction observations',
	},
})({
	$transaction: {
		label: 'transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.XrplTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	ledgerIndex: {
		label: 'ledger index',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fee: {
		label: 'fee',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	status: {
		label: 'status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validated: {
		label: 'validated',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	meta: {
		label: 'meta',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	resultCode: {
		label: 'result code',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		TransactionLedgerIndexSource: [
			'$transaction',
			'ledgerIndex',
			'source',
		],
	},
})
