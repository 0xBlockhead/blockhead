import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum PayoutSelector {
	SourcePayoutId = 'source+payoutId',
}
export default {
	entityType: EntityType.Payout,
	label: 'payout',
	labelPlural: 'payouts',
	selectors: [
		{
			name: PayoutSelector.SourcePayoutId,
			fields: [
				'source',
				'payoutId',
			],
		},
	],
	fields: [
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'payoutId',
			label: 'payout ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$assetInstance',
			label: 'asset instance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AssetInstance,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$assetClass',
			label: 'asset class',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AssetClass,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$distributorContract',
			label: 'distributor contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'snapshotCoordinate',
			label: 'snapshot coordinate',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'merkleRoot',
			label: 'merkle root',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'paymentAsset',
			label: 'payment asset',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'totalAmount',
			label: 'total amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'recipientCount',
			label: 'recipient count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'openedAt',
			label: 'opened AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'closedAt',
			label: 'closed AT',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$claims',
			label: 'claims',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.PayoutClaim_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition
