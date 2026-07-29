// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarClaimableBalance,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	ledgerSequence: {
		label: 'ledger sequence',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$asset: {
		label: 'asset',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sponsor: {
		label: 'sponsor',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	claimants: {
		label: 'claimants',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.Many,
	},
	$claimedByTransaction: {
		label: 'claimed by transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StellarTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deleted: {
		label: 'deleted',
		type: EntityFieldType.Primitive,
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
