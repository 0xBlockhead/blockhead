// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum PayoutSelector {
	SourcePayoutId = 'SourcePayoutId',
}
export const Payout = entity({
	entityType: EntityType.Payout,
	labels: {
		singular: 'payout',
		plural: 'payouts',
	},
})({
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	payoutId: {
		label: 'payout ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$assetInstance: {
		label: 'asset instance',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AssetInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$assetClass: {
		label: 'asset class',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.AssetClass,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$distributorContract: {
		label: 'distributor contract',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	snapshotCoordinate: {
		label: 'snapshot coordinate',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	merkleRoot: {
		label: 'merkle root',
		type: EntityFieldType.Primitive,
		primitiveType: (ZeroExHex),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	paymentAsset: {
		label: 'payment asset',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	totalAmount: {
		label: 'total amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	recipientCount: {
		label: 'recipient count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	openedAt: {
		label: 'opened AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	closedAt: {
		label: 'closed AT',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$claims: {
		label: 'claims',
		type: EntityFieldType.EntitiesReference,
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
