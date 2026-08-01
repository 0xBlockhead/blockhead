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
		label: 'ledger',
		entityType: EntityType.IcpLedgerCanister,
		cardinality: EntityFieldCardinality.One,
	},
	owner: {
		label: 'owner',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	subaccount: {
		label: 'subaccount',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	balance: {
		label: 'balance',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	allowanceCount: {
		label: 'allowance count',
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
