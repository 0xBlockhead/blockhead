// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Payout,
	labels: {
		singular: 'payout',
		plural: 'payouts',
	},
})({
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	payoutId: {
		label: 'payout ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$assetInstance: {
		label: 'asset instance',
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$assetClass: {
		label: 'asset class',
		entityType: EntityType.AssetClass,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$distributorContract: {
		label: 'distributor contract',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	snapshotCoordinate: {
		label: 'snapshot coordinate',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	merkleRoot: {
		label: 'merkle root',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	paymentAsset: {
		label: 'payment asset',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalAmount: {
		label: 'total amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	recipientCount: {
		label: 'recipient count',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	openedAt: {
		label: 'opened AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	closedAt: {
		label: 'closed AT',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$claims: {
		label: 'claims',
		entityType: EntityType.PayoutClaim_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		SourcePayoutId: [
			'source',
			'payoutId',
		],
	},
})
