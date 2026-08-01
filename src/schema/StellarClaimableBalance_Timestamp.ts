// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.StellarClaimableBalance_Timestamp,
	labels: {
		singular: 'stellar claimable balance timestamp',
		plural: 'stellar claimable balance observations',
	},
})({
	$claimableBalance: {
		label: 'claimable balance',
		entityType: EntityType.StellarClaimableBalance,
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
	ledgerSequence: {
		label: 'ledger sequence',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$asset: {
		label: 'asset',
		entityType: EntityType.StellarAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'amount',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sponsor: {
		label: 'sponsor',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	claimants: {
		label: 'claimants',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.Many,
	},
	$claimedByTransaction: {
		label: 'claimed by transaction',
		entityType: EntityType.StellarTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deleted: {
		label: 'deleted',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ClaimableBalanceTimestampMsSource: [
			'$claimableBalance',
			'timestampMs',
			'source',
		],
	},
})
