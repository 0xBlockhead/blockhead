// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AptosAccount_Timestamp,
	labels: {
		singular: 'aptos account timestamp',
		plural: 'aptos account observations',
	},
})({
	$account: {
		label: 'account',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AptosAccount,
		cardinality: EntityFieldCardinality.One,
	},
	ledgerVersion: {
		label: 'ledger version',
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
	blockHeight: {
		label: 'block height',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	epoch: {
		label: 'epoch',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sequenceNumber: {
		label: 'sequence number',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	authenticationKey: {
		label: 'authentication key',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		AccountLedgerVersionSource: [
			'$account',
			'ledgerVersion',
			'source',
		],
	},
})
