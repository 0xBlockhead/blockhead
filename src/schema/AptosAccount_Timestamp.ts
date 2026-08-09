// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.AptosAccount,
		cardinality: EntityFieldCardinality.One,
	},
	ledgerVersion: {
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockHeight: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	epoch: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sequenceNumber: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	authenticationKey: {
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
