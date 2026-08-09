// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IcpLedgerAccount_Timestamp,
	labels: {
		singular: 'icp ledger account timestamp',
		plural: 'icp ledger account observations',
	},
})({
	$ledger: {
		entityType: EntityType.IcpLedgerCanister,
		cardinality: EntityFieldCardinality.One,
	},
	owner: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	subaccount: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	balance: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	allowanceCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		LedgerOwnerSubaccountTimestampMsSource: [
			'$ledger',
			'owner',
			'subaccount',
			'timestampMs',
			'source',
		],
	},
})
