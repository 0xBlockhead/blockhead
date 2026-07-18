// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum XrplAccount_TimestampSelector {
	AccountLedgerIndexSource = 'AccountLedgerIndexSource',
}
export const XrplAccount_Timestamp = entity({
	entityType: EntityType.XrplAccount_Timestamp,
	labels: {
		singular: 'xrpl account timestamp',
		plural: 'xrpl account observations',
	},
})({
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.XrplAccount,
		cardinality: EntityFieldCardinality.One,
	},
	ledgerIndex: {
		label: 'ledger index',
		type: EntityFieldType.Primitive,
		primitiveType: (type('bigint').narrow((value) => value >= 0n)),
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
	balanceDrops: {
		label: 'balance drops',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ownerCount: {
		label: 'owner count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sequence: {
		label: 'sequence',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	flags: {
		label: 'flags',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AccountLedgerIndexSource: [
			'$account',
			'ledgerIndex',
			'source',
		],
	},
})
