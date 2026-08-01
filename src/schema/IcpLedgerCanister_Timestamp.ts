// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.IcpLedgerCanister_Timestamp,
	labels: {
		singular: 'icp ledger canister timestamp',
		plural: 'icp ledger canister observations',
	},
})({
	$ledger: {
		label: 'ledger',
		entityType: EntityType.IcpLedgerCanister,
		cardinality: EntityFieldCardinality.One,
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
	symbol: {
		label: 'Symbol',
		description: 'The short ticker or symbol used for display.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	decimals: {
		label: 'Decimals',
		description: 'The number of decimal places used to display the amount.',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fee: {
		label: 'fee',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	archiveCanisterIds: {
		label: 'archive canister ids',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	supportedStandards: {
		label: 'supported standards',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
	},
	latestBlockIndex: {
		label: 'latest block index',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		LedgerTimestampMsSource: [
			'$ledger',
			'timestampMs',
			'source',
		],
	},
})
